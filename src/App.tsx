import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SlidersHorizontal,
  X,
  ArrowRight,
  Plane,
  Camera,
} from 'lucide-react';
import { CameraView } from './components/globe/CameraRig';
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
    motion,
    isPlaying,
    speed,
    setIsPlaying,
    setSpeed,
    goToSegment,
  } = useTravelPlayback();
  const stats = useMemo(() => computeExtendedStats(travelData), []);
  const [routeView, setRouteView] = useState<'current' | 'year' | 'all'>(
    'current',
  );
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [cameraView, setCameraView] = useState<CameraView>('earth');
  const [camerasOpen, setCamerasOpen] = useState(false);
  const cameraButton = useRef<HTMLButtonElement>(null);
  const cameraPanel = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<number | null>(null);
  const [pinnedPlaceId, setPinnedPlaceId] = useState<number | null>(null);
  const filterButton = useRef<HTMLButtonElement>(null);
  const detailsButton = useRef<HTMLButtonElement>(null);
  const filterPanel = useRef<HTMLDivElement>(null);
  const detailsPanel = useRef<HTMLElement>(null);
  const from = travelData[activeSegment];
  const to = travelData[activeSegment + 1];
  const filterLabel =
    routeView === 'current'
      ? 'Current flight'
      : routeView === 'all'
        ? 'All years'
        : `${yearFilter} routes`;
  useEffect(() => {
    if (camerasOpen) cameraPanel.current?.focus();
    if (filtersOpen) filterPanel.current?.focus();
    if (detailsOpen) detailsPanel.current?.focus();
  }, [filtersOpen, detailsOpen, camerasOpen]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (camerasOpen) {
        setCamerasOpen(false);
        cameraButton.current?.focus();
      } else if (filtersOpen) {
        setFiltersOpen(false);
        filterButton.current?.focus();
      } else if (detailsOpen) {
        setDetailsOpen(false);
        detailsButton.current?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [filtersOpen, detailsOpen, camerasOpen]);
  const handleLegSelect = (index: number) => {
    goToSegment(index);
    setIsPlaying(false);
  };
  const selectYear = (year: number | null) => {
    setYearFilter(year);
    setRouteView(year === null ? 'all' : 'year');
  };
  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0">
        <GlobeScene
          cameraView={cameraView}
          activeSegment={activeSegment}
          motion={motion}
          isPlaying={isPlaying}
          onLegSelect={handleLegSelect}
          highlightedPlaceId={hoveredPlaceId}
          pinnedPlaceId={pinnedPlaceId}
          onPlaceHover={setHoveredPlaceId}
          onPlaceSelect={setPinnedPlaceId}
          yearFilter={yearFilter}
          routeView={routeView}
        />
      </div>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-b from-[#050816] to-transparent p-5 pb-12 sm:p-8 sm:pb-16">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[.24em] text-sky-200/70">
            Thomas Guntenaar
          </p>
          <h1 className="font-display mt-1 text-3xl tracking-tight text-white sm:text-4xl">
            Flight Atlas
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {stats.totalFlights} flights{' '}
            <span className="px-1 text-slate-600">/</span>{' '}
            {stats.totalCountries} countries
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2 sm:flex-row">
          <button
            ref={cameraButton}
            className="atlas-button gap-2"
            aria-expanded={camerasOpen}
            aria-controls="camera-views"
            onClick={() => {
              setCamerasOpen((v) => !v);
              setFiltersOpen(false);
              setDetailsOpen(false);
            }}
          >
            <Camera size={15} />
            <span>Camera</span>
            {cameraView !== 'earth' && (
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            )}
          </button>
          <button
            ref={filterButton}
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="route-filters"
            onClick={() => {
              setCamerasOpen(false);
              setFiltersOpen((v) => !v);
              setDetailsOpen(false);
            }}
            className="atlas-button pointer-events-auto gap-2"
          >
            <SlidersHorizontal size={15} /> <span>Filters</span>
            {routeView !== 'current' && (
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            )}
          </button>
        </div>
      </header>
      {camerasOpen && (
        <div
          id="camera-views"
          ref={cameraPanel}
          tabIndex={-1}
          aria-label="Camera views"
          className="atlas-panel absolute right-5 top-32 z-30 w-[min(320px,calc(100%-40px))] p-5 sm:right-8 sm:top-24"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">A different perspective</h2>
            <button
              className="atlas-icon"
              aria-label="Close cameras"
              onClick={() => {
                setCamerasOpen(false);
                cameraButton.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-2">
            {(
              [
                [
                  'earth',
                  'Earth',
                  'Explore the globe. Drag to orbit, scroll to zoom.',
                ],
                ['moon', 'From the Moon', 'Earth above a quiet lunar horizon.'],
                [
                  'starship',
                  'Track Starship',
                  'Follow Starship with Earth in the background.',
                ],
              ] as const
            ).map(([value, label, description]) => (
              <button
                key={value}
                className="atlas-choice text-left"
                aria-pressed={cameraView === value}
                onClick={() => {
                  setCameraView(value);
                  setCamerasOpen(false);
                  cameraButton.current?.focus();
                }}
              >
                <span className="block text-sm font-medium">{label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                  {description}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Cinematic viewpoints. Pause playback to hold the scene still.
            <a href="/credits/starship.txt" target="_blank" rel="noreferrer" className="mt-2 block underline underline-offset-4">
              Starship model: David Leeds · CC BY 4.0
            </a>
          </p>
        </div>
      )}
      {filtersOpen && (
        <div
          id="route-filters"
          ref={filterPanel}
          tabIndex={-1}
          aria-label="Route filters"
          className="atlas-panel absolute right-5 top-32 z-30 w-[min(320px,calc(100%-40px))] p-5 sm:right-8 sm:top-24"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Show on the globe</h2>
            <button
              className="atlas-icon"
              aria-label="Close filters"
              onClick={() => {
                setFiltersOpen(false);
                filterButton.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="atlas-choice"
              aria-pressed={routeView === 'current'}
              onClick={() => {
                setRouteView('current');
                setYearFilter(null);
              }}
            >
              Current flight
            </button>
            <button
              className="atlas-choice"
              aria-pressed={routeView === 'all'}
              onClick={() => selectYear(null)}
            >
              All routes
            </button>
          </div>
          <p className="mb-2 mt-5 text-[10px] uppercase tracking-[.16em] text-slate-400">
            Explore a year
          </p>
          <div className="flex flex-wrap gap-2">
            {timelineYears.map((year) => (
              <button
                key={year}
                className="atlas-choice flex items-center gap-2"
                aria-pressed={routeView === 'year' && yearFilter === year}
                onClick={() => selectYear(year)}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: colorForYear(year) }}
                />
                {year}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            {routeView === 'current'
              ? 'Follow the active journey, without the clutter.'
              : 'Every route in your selection is visible, including upcoming journeys. Dotted lines are ground travel.'}
          </p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#050816] to-transparent px-4 pb-5 pt-16 sm:px-8 sm:pb-7">
        <div className="mx-auto max-w-md">
          <div className="mb-3 flex items-center justify-between text-[10px] tracking-wide text-slate-400">
            <span>{filterLabel}</span>
            <span>
              {cameraView === 'earth'
                ? 'Drag to explore · Pinch to zoom'
                : cameraView === 'moon'
                  ? 'View from the Moon'
                  : 'Tracking Starship'}
            </span>
          </div>
          <div className="atlas-panel pointer-events-auto flex items-center gap-3 p-3">
            <button
              className="atlas-icon h-11 w-11 shrink-0 bg-white/5"
              aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button
              ref={detailsButton}
              className="min-w-0 flex-1 text-left"
              aria-expanded={detailsOpen}
              aria-controls="flight-details"
              onClick={() => {
                setCamerasOpen(false);
                setDetailsOpen((v) => !v);
                setFiltersOpen(false);
              }}
            >
              <span className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[.14em] text-slate-400">
                <Plane size={11} />
                {to.travelMode === 'ground'
                  ? 'Ground journey'
                  : 'Current flight'}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <span className="truncate">{from.city}</span>
                <ArrowRight size={13} className="shrink-0 text-slate-500" />
                <span className="truncate">{to.city}</span>
              </span>
              <span className="mt-1 block text-[10px] text-slate-400">
                {to.date} · {detailsOpen ? 'Hide details' : 'Flight details'}
              </span>
            </button>
            <button
              className="atlas-icon shrink-0"
              aria-label={
                detailsOpen ? 'Hide flight details' : 'Show flight details'
              }
              aria-expanded={detailsOpen}
              aria-controls="flight-details"
              onClick={() => {
                setCamerasOpen(false);
                setDetailsOpen((v) => !v);
                setFiltersOpen(false);
              }}
            >
              {detailsOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronUp size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
      {detailsOpen && (
        <aside
          id="flight-details"
          ref={detailsPanel}
          tabIndex={-1}
          aria-label="Flight details"
          className="atlas-panel absolute inset-x-4 bottom-36 z-20 max-h-[calc(100dvh-260px)] overflow-y-auto sm:inset-x-auto sm:bottom-40 sm:right-8 sm:top-28 sm:w-96 sm:max-h-none"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1222] px-5 py-3">
            <h2 className="text-sm font-semibold">Flight details</h2>
            <button
              className="atlas-icon"
              aria-label="Close flight details"
              onClick={() => {
                setDetailsOpen(false);
                detailsButton.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-5 p-4">
            <StatsPanel
              stats={stats}
              activeSegment={activeSegment}
              progress={progress}
            />
            <details>
              <summary className="cursor-pointer py-2 text-sm font-medium text-slate-200">
                Browse timeline & playback
              </summary>
              <div className="pt-3">
                <FlightTimeline
                  activeSegment={activeSegment}
                  progress={progress}
                  isPlaying={isPlaying}
                  yearFilter={routeView === 'year' ? yearFilter : null}
                  onYearFilter={selectYear}
                  onSelectLeg={handleLegSelect}
                  onTogglePlay={() => setIsPlaying((p) => !p)}
                  onSpeedChange={setSpeed}
                  speed={speed}
                />
              </div>
            </details>
          </div>
        </aside>
      )}
    </main>
  );
}
