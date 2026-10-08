import { ExtendedTravelStats } from '../../utils/travelAnalytics';
import { travelData } from '../../data/travelData';
import { colorForYear } from '../../utils/yearColors';
import { calculateDistanceInKm } from '../../utils/coordinates';
import { isFlightSegment } from '../../data/travelData';

interface StatsPanelProps {
  stats: ExtendedTravelStats;
  activeSegment: number;
  progress: number;
}

export function StatsPanel({ stats, activeSegment, progress }: StatsPanelProps) {
  const from = travelData[activeSegment];
  const to = travelData[activeSegment + 1];
  const isFlight = isFlightSegment(from, to);
  const legDistance = isFlight
    ? calculateDistanceInKm(
        from.coordinates[0],
        from.coordinates[1],
        to.coordinates[0],
        to.coordinates[1]
      )
    : 0;

  const traveledOnLeg = Math.round(legDistance * progress);

  let cumulative = 0;
  for (let i = 0; i < activeSegment; i++) {
    const a = travelData[i];
    const b = travelData[i + 1];
    if (!isFlightSegment(a, b)) continue;
    cumulative += calculateDistanceInKm(
      a.coordinates[0],
      a.coordinates[1],
      b.coordinates[0],
      b.coordinates[1]
    );
  }
  cumulative += traveledOnLeg;

  return (
    <div className="grid gap-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Current leg</p>
        {isFlight ? (
          <>
            <p className="mt-1 text-lg font-semibold text-white">
              {from.city} → {to.city}
            </p>
            <p className="text-sm text-slate-400">
              {to.date} · {legDistance.toLocaleString()} km
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-slate-300">Ground segment · {to.city}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Flights" value={String(stats.totalFlights)} />
        <StatCard label="Countries" value={String(stats.totalCountries)} />
        <StatCard label="Cities" value={String(stats.totalCities)} />
        <StatCard
          label="Distance"
          value={`${stats.totalDistance.toLocaleString()} km`}
        />
        <StatCard label="Traveled so far" value={`${Math.round(cumulative).toLocaleString()} km`} />
        <StatCard
          label="Longest leg"
          value={
            stats.longestLeg
              ? `${stats.longestLeg.distanceKm.toLocaleString()} km`
              : '—'
          }
          hint={
            stats.longestLeg
              ? `${stats.longestLeg.from.city} → ${stats.longestLeg.to.city}`
              : undefined
          }
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          Flights per year
        </p>
        <div className="space-y-2">
          {Object.entries(stats.flightsPerYear)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([year, count]) => (
              <div key={year} className="flex items-center gap-2 text-sm">
                <span className="w-10 text-slate-400">{year}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / stats.totalFlights) * 100}%`,
                      backgroundColor: colorForYear(Number(year)),
                    }}
                  />
                </div>
                <span className="w-6 text-right text-slate-300">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
      {hint && <p className="truncate text-[10px] text-slate-500">{hint}</p>}
    </div>
  );
}
