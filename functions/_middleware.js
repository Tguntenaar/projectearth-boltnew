// Gate for /atlas/* (public/_routes.json limits this middleware to those paths).
//
// Cloudflare Access sits in front of flights.thomasguntenaar.com/atlas and does
// the sign-in: one-time PIN by email, allowed email providers only. That policy
// is the single source of truth for WHO gets in. This middleware only checks
// that a request actually came through Access, by verifying the
// Cf-Access-Jwt-Assertion JWT (signature against the team's public keys,
// audience, expiry, issuer). It FAILS CLOSED: until ACCESS_TEAM_DOMAIN and
// ACCESS_AUD are set, /atlas serves 403 to everyone. That is what keeps the
// *.pages.dev hostnames, which Access does not cover, from serving the data.
//
// ACCESS_DEV_BYPASS=1 skips the check for `wrangler pages dev` ONLY.

let certsCache = { team: null, keys: null, fetched: 0 };

async function accessCerts(team) {
  if (certsCache.team === team && certsCache.keys && Date.now() - certsCache.fetched < 3600_000) {
    return certsCache.keys;
  }
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!res.ok) return null;
  const body = await res.json();
  certsCache = { team, keys: body.keys || [], fetched: Date.now() };
  return certsCache.keys;
}

function b64urlToBytes(s) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}

async function verifyAccess(request, env) {
  if (env.ACCESS_DEV_BYPASS === '1') return true;
  const team = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  if (!team || !aud) return false; // fail closed until Access is configured

  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return false;
  const parts = jwt.split('.');
  if (parts.length !== 3) return false;

  let header, payload;
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
    payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
  } catch {
    return false;
  }

  const now = Date.now() / 1000;
  const audOk = [].concat(payload.aud || []).includes(aud);
  if (!audOk || !(payload.exp > now) || payload.iss !== `https://${team}.cloudflareaccess.com`) {
    return false;
  }

  const keys = await accessCerts(team);
  const jwk = keys && keys.find((k) => k.kid === header.kid);
  if (!jwk) return false;

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  return crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
}

const FORBIDDEN = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Sign in required · Flight Atlas</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#050816;color:#cbd5e1;font:16px/1.5 system-ui,sans-serif;padding:16px}a{color:#7dd3fc}</style>
</head><body><p>Sign in at <a href="https://flights.thomasguntenaar.com/">flights.thomasguntenaar.com</a> to view the atlas.</p></body></html>`;

export async function onRequest({ request, env, next }) {
  if (await verifyAccess(request, env)) return next();
  return new Response(FORBIDDEN, {
    status: 403,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}
