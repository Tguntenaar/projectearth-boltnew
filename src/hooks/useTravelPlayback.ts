import { useCallback, useEffect, useRef, useState } from 'react';
import { travelData, isFlightSegment } from '../data/travelData';

function nextFlightSegment(from: number): number {
  let next = from;
  let guard = 0;
  while (guard < travelData.length) {
    if (isFlightSegment(travelData[next], travelData[next + 1])) {
      return next;
    }
    next = (next + 1) % (travelData.length - 1);
    guard += 1;
  }
  return 0;
}

export function useTravelPlayback(initialSpeed = 0.004) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);
  const rafRef = useRef<number>();

  const activeSegment = nextFlightSegment(segmentIndex);

  const goToSegment = useCallback((index: number, resetProgress = true) => {
    const clamped = Math.max(0, Math.min(travelData.length - 2, index));
    setSegmentIndex(nextFlightSegment(clamped));
    if (resetProgress) setProgress(0);
  }, []);

  const stepSegment = useCallback((delta: number) => {
    setSegmentIndex((current) => {
      let next = current + delta;
      if (next < 0) next = travelData.length - 2;
      if (next > travelData.length - 2) next = 0;
      return nextFlightSegment(next);
    });
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      setProgress((prev) => {
        const next = prev + speed;
        if (next >= 1) {
          setSegmentIndex((current) => {
            let nextSeg = (current + 1) % (travelData.length - 1);
            return nextFlightSegment(nextSeg);
          });
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed]);

  return {
    segmentIndex,
    activeSegment,
    progress,
    isPlaying,
    speed,
    setIsPlaying,
    setSpeed,
    setProgress,
    goToSegment,
    stepSegment,
  };
}
