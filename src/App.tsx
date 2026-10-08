import { useMemo, useState } from 'react';
import { GlobeScene } from './components/globe/GlobeScene';
import { FlightTimeline } from './components/panels/FlightTimeline';
import { StatsPanel } from './components/panels/StatsPanel';
import { useTravelPlayback } from './hooks/useTravelPlayback';
import { computeExtendedStats } from './utils/travelAnalytics';
import { travelData } from './data/travelData';
import { colorForYear, timelineYears } from './utils/yearColors';

export default function App() {
  const {
    activeSegment,
    progress,
    isPlaying,
    speed,
    setIsPlaying,
    setSpeed,
    goToSegment,
  } = useTravelPlayback();

  const stats = useMemo(() => computeExtendedStats(travelData), []);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<number | null>(null);
  const [pinnedPlaceId, setPinnedPlaceId] = useState<number | null>(null);

  const handleLegSelect = (index: number) => {
    goToSegment(index);
    setIsPlaying(false);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#050816] text-slate-100">
      <header className="z-10 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300/80">
              Thomas Guntenaar
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Flight Atlas
            </h1>
            <p className="text-sm text-slate-400">
              Personal travel map · {stats.totalFlights} flights · {timelineYears[0]}–
              {timelineYears[timelineYears.length - 1]}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            {timelineYears.map((year) => (
              <span key={year} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colorForYear(year) }}
                />
                {year}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
        <section className="relative min-h-[52vh] flex-1 lg:min-h-0">
          <GlobeScene
            activeSegment={activeSegment}
            progress={progress}
            isPlaying={isPlaying}
            onLegSelect={handleLegSelect}
            highlightedPlaceId={hoveredPlaceId}
            pinnedPlaceId={pinnedPlaceId}
            onPlaceHover={setHoveredPlaceId}
            onPlaceSelect={setPinnedPlaceId}
            yearFilter={yearFilter}
          />
          <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[10px] text-slate-300 backdrop-blur-sm sm:text-xs">
            Drag to rotate · Scroll to zoom · Tap a city for details
          </p>
        </section>

        <aside
          className="flex max-h-[48vh] flex-col gap-4 overflow-hidden border-t border-white/10 bg-slate-950/90 p-4 backdrop-blur-md lg:max-h-none lg:w-[min(100%,24rem)] lg:border-l lg:border-t-0 lg:overflow-y-auto"
        >
          <StatsPanel stats={stats} activeSegment={activeSegment} progress={progress} />
          <FlightTimeline
            activeSegment={activeSegment}
            progress={progress}
            isPlaying={isPlaying}
            yearFilter={yearFilter}
            onYearFilter={setYearFilter}
            onSelectLeg={handleLegSelect}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            onSpeedChange={setSpeed}
            speed={speed}
          />
        </aside>
      </div>
    </div>
  );
}
