import { useRef, useMemo, useState } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { TravelLocation } from "../types/travel";
import { latLongToVector3 } from "../utils/coordinates";
import { createPortal } from "react-dom";

interface FlightPathProps {
  from: TravelLocation;
  to: TravelLocation;
  progress: number;
  rotation: number;
}

export function FlightPath({ from, to, progress, rotation }: FlightPathProps) {
  const curveRef = useRef<THREE.QuadraticBezierCurve3>();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const points = useMemo(() => {
    console.log(from.city, to.city, from.coordinates, to.coordinates);
    const start = latLongToVector3(from.coordinates[0], from.coordinates[1]);
    const end = latLongToVector3(to.coordinates[0], to.coordinates[1]);

    // TODO Fix this the coordinates are not correct after this

    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(1.5);

    curveRef.current = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    return curveRef.current.getPoints(5);
  }, [from, to]);

  const rotatedPoints = points.map((point) => {
    const rotated = point.clone();
    rotated.applyAxisAngle(new THREE.Vector3(0, -1, 0), rotation);
    rotated.x = -rotated.x;
    return rotated;
  });

  const handlePointerOver = (event: THREE.Event, point: THREE.Vector3) => {
    setHoveredPoint(
      `x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)}, z: ${point.z.toFixed(
        2
      )}`
    );
    // console.log(typeof event);
    // console.log(event);
    console.log("To city:", to.city);
    // TODO Fix this
    // setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handlePointerOut = () => {
    setHoveredPoint(null);
    setTooltipPosition(null);
  };

  return (
    <>
      <Line
        points={rotatedPoints}
        color="cyan"
        lineWidth={1}
        dashed={true}
        dashScale={50}
        dashSize={0.5}
        dashOffset={-progress * 2}
      />

      <mesh
        position={rotatedPoints[rotatedPoints.length - 1]}
        onPointerOver={(event) =>
          handlePointerOver(event, rotatedPoints[rotatedPoints.length - 1])
        }
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="green" />
      </mesh>
      {hoveredPoint &&
        tooltipPosition &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "5px",
              borderRadius: "3px",
              pointerEvents: "none",
            }}
          >
            {hoveredPoint}
          </div>,
          document.body
        )}
    </>
  );
}
