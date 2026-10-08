import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { TravelLocation } from '../../types/travel';
import { sampleGreatCircleArc, spinArcPoints } from '../../utils/globeMath';
import { colorForDate } from '../../utils/yearColors';

interface FlightArcProps {
  from: TravelLocation;
  to: TravelLocation;
  rotation: number;
  progress: number;
  isActive: boolean;
  dimmed?: boolean;
  color?: string;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: () => void;
}

export function FlightArc({
  from,
  to,
  rotation,
  progress,
  isActive,
  dimmed = false,
  color,
  onPointerOver,
  onPointerOut,
  onClick,
}: FlightArcProps) {
  const arcColor = color ?? colorForDate(to.date);

  const { fullPath, traveledPath, hitPoints } = useMemo(() => {
    const samples = sampleGreatCircleArc(from, to, 80);
    const spun = spinArcPoints(samples, rotation);
    const traveledCount = Math.max(2, Math.floor(progress * (spun.length - 1)) + 1);
    return {
      fullPath: spun,
      traveledPath: spun.slice(0, traveledCount),
      hitPoints: spun,
    };
  }, [from, to, rotation, progress]);

  const baseOpacity = dimmed ? 0.02 : isActive ? 0.22 : 0.06;
  const traveledOpacity = dimmed ? 0.04 : isActive ? 1 : 0.35;

  return (
    <group
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <Line
        points={fullPath}
        color={arcColor}
        lineWidth={isActive ? 1.2 : 0.6}
        transparent
        opacity={baseOpacity}
        depthWrite={false}
      />
      <Line
        points={traveledPath}
        color={arcColor}
        lineWidth={isActive ? 2.8 : 1.2}
        transparent
        opacity={traveledOpacity}
        depthWrite={false}
      />
      {isActive && traveledPath.length > 2 && (
        <Line
          points={traveledPath.slice(-8)}
          color="#ffffff"
          lineWidth={3.5}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      )}
      {/* Invisible thicker line for easier hover/tap */}
      <Line points={hitPoints} lineWidth={12} transparent opacity={0} depthWrite={false} />
    </group>
  );
}
