import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Earth() {
  const [colorMap, normalMap, specularMap] = useTexture([
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    "https://unpkg.com/three-globe/example/img/earth-topology.png",
    "https://unpkg.com/three-globe/example/img/earth-water.png",
  ]);

  return (
    <mesh>
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
