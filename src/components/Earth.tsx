import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface EarthProps {
  rotation: number;
}

export function Earth({ rotation }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const [colorMap, normalMap, specularMap] = useTexture([
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    "https://unpkg.com/three-globe/example/img/earth-topology.png",
    "https://unpkg.com/three-globe/example/img/earth-water.png",
  ]);

  if (earthRef.current) {
    earthRef.current.rotation.y = rotation;
  }

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        shininess={5}
      />
    </mesh>
  );
}
