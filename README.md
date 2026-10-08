# Project Earth with bolt.new

Trying out bolt.new to quickly sets up a new development environment
## Hosting and access

Served by the Cloudflare Pages project `flights-thomasguntenaar` (account `0df9c0ffdddfbbaa2e9d11e0c6b70558`) on flights.thomasguntenaar.com.

- `/` is the public teaser (`public/index.html`), which keeps link previews working.
- `/atlas/` is the app (`atlas/index.html`). It sits behind Cloudflare Access (team `geforcy`): one-time PIN by email, allowed email providers only. The Access policy is the single source of truth for who gets in.
- `functions/_middleware.js` (scoped to `/atlas/*` by `public/_routes.json`) verifies the Access JWT and fails closed, so the `*.pages.dev` hostnames, which Access doesn't cover, can't serve the atlas or its data.

Deploy:

```sh
npm run build
CLOUDFLARE_ACCOUNT_ID=0df9c0ffdddfbbaa2e9d11e0c6b70558 npx wrangler@4 pages deploy dist --project-name flights-thomasguntenaar --branch main
```

Local dev: `npm run dev`, then open `/atlas/`.
