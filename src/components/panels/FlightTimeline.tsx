import { useMemo, useRef, useEffect } from 'react';
import { buildFlightLegs, FlightLeg } from '../../utils/travelAnalytics';
import { travelData } from '../../data/travelData';
import { colorForYear, timelineYears } from '../../utils/yearColors';
import { Slider } from '../ui/slider';

interface FlightTimelineProps {
  activeSegment: number;
  progress: number;
  isPlaying: boolean;
  yearFilter: number | null;
  onYearFilter: (year: number | null) => void;
  onSelectLeg: (segmentIndex: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
}

export function FlightTimeline({
  activeSegment,
  progress,
  isPlaying,
  yearFilter,
  onYearFilter,
  onSelectLeg,
  onTogglePlay,
  onSpeedChange,
  speed,
}: FlightTimelineProps) {
  const legs = useMemo(() => buildFlightLegs(travelData), []);
  const activeLegRef = useRef<HTMLButtonElement>(null);

  const grouped = useMemo(() => {
    const map = new Map<number, FlightLeg[]>();
    for (const leg of legs) {
      if (yearFilter !== null && leg.year !== yearFilter) continue;
      const list = map.get(leg.year) ?? [];
      list.push(leg);
      map.set(leg.year, list);
    }
    return timelineYears
      .filter((y) => map.has(y))
      .map((year) => ({ year, legs: map.get(year)! }));
  }, [legs, yearFilter]);

  useEffect(() => {
    activeLegRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeSegment]);

  const sliderValue = activeSegment;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onYearFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            yearFilter === null
              ? 'bg-white text-slate-900'
              : 'bg-white/10 text-slate-300 hover:bg-white/15'
          }`}
        >
          All years
        </button>
        {timelineYears.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => onYearFilter(yearFilter === year ? null : year)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
              yearFilter === year
                ? 'border-transparent text-slate-900'
                : 'border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            style={yearFilter === year ? { backgroundColor: colorForYear(year) } : undefined}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="text-xs text-slate-400">Speed</span>
        <Slider
          className="flex-1"
          min={0.001}
          max={0.012}
          step={0.001}
          value={[speed]}
          onValueChange={([v]) => onSpeedChange(v)}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-slate-400">Scrub timeline</label>
        <Slider
          min={0}
          max={travelData.length - 2}
          step={1}
          value={[sliderValue]}
          onValueChange={([v]) => onSelectLeg(v)}
        />
      </div>

      <div className="max-h-[38vh] overflow-y-auto pr-1 space-y-4 lg:max-h-none lg:flex-1">
        {grouped.map(({ year, legs: yearLegs }) => (
          <section key={year}>
            <h3
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colorForYear(year) }}
            >
              {year}
            </h3>
            <ul className="space-y-1">
              {yearLegs.map((leg) => {
                const isActive = leg.index === activeSegment;
                return (
                  <li key={leg.index}>
                    <button
                      ref={isActive ? activeLegRef : undefined}
                      type="button"
                      onClick={() => onSelectLeg(leg.index)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? 'border-white/30 bg-white/10 text-white'
                          : 'border-transparent bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">
                          {leg.from.city} → {leg.to.city}
                        </span>
                        <span className="shrink-0 text-xs text-slate-400">{leg.date}</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${isActive ? Math.max(progress * 100, 6) : 0}%`,
                            backgroundColor: colorForYear(year),
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">{leg.distanceKm.toLocaleString()} km</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
