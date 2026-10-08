import { useCallback, useEffect, useRef, useState } from 'react';
import { travelData } from '../data/travelData';
function nextMovingSegment(index: number): number {
  for (let checked = 0; checked < travelData.length - 1; checked++) {
    const from = travelData[index].coordinates;
    const to = travelData[index + 1].coordinates;
    if (from[0] !== to[0] || from[1] !== to[1]) return index;
    index = (index + 1) % (travelData.length - 1);
  }
  return index;
}
export interface PlaybackMotion {
  progress: number;
  segment: number;
}
export function useTravelPlayback(initialSpeed = 0.004) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  // Autoplays even with the OS "Reduce motion" setting on (Thomas's choice);
  // pausing still holds the whole scene still.
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);
  const motion = useRef<PlaybackMotion>({ progress: 0, segment: 0 });
  const goToSegment = useCallback((index: number, resetProgress = true) => {
    const segment = Math.max(0, Math.min(travelData.length - 2, index));
    motion.current.segment = segment;
    if (resetProgress) motion.current.progress = 0;
    setSegmentIndex(segment);
    setProgress(motion.current.progress);
  }, []);
  const stepSegment = useCallback(
    (delta: number) =>
      goToSegment(
        (motion.current.segment + delta + travelData.length - 1) %
          (travelData.length - 1),
      ),
    [goToSegment],
  );
  useEffect(() => {
    if (!isPlaying) return;
    let raf: number;
    let previous = performance.now();
    let lastPublish = previous;
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      motion.current.progress += dt * speed * 60;
      if (motion.current.progress >= 1) {
        motion.current.progress = 0;
        motion.current.segment = nextMovingSegment(
          (motion.current.segment + 1) % (travelData.length - 1),
        );
        setSegmentIndex(motion.current.segment);
      }
      // Canvas reads the ref at display refresh rate; sidebar only updates at 10 Hz.
      if (now - lastPublish >= 100 || motion.current.progress === 0) {
        setProgress(motion.current.progress);
        lastPublish = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setProgress(motion.current.progress);
    };
  }, [isPlaying, speed]);
  return {
    segmentIndex,
    activeSegment: segmentIndex,
    progress,
    isPlaying,
    speed,
    motion,
    setIsPlaying,
    setSpeed,
    goToSegment,
    stepSegment,
  };
}
