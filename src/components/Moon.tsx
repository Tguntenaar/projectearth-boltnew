import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface MoonProps {
  position: THREE.Vector3 | [number, number, number];
}

export function Moon({ position }: MoonProps) {

  // const moonGroup = new THREE.Group();
  // scene.add(moonGroup);
  // const moonMat = new THREE.MeshStandardMaterial({
  //   map: loader.load("./textures/06_moonmap4k.jpg"),
  //   bumpMap: loader.load("./textures/07_moonbump4k.jpg"),
  //   bumpScale: 2,
  // });
  // const moonMesh = new THREE.Mesh(geometry, moonMat);
  // moonMesh.position.set(2, 0, 0);
  // moonMesh.scale.setScalar(0.27);
  // moonGroup.add(moonMesh);

  const [colorMap, normalMap, specularMap] = useTexture([
    // Replace these texture URLs with your preferred moon textures
    "./textures/06_moonmap4k.jpg",
    "./textures/07_moonbump4k.jpg",
  ]);

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.27, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        shininess={5}
      />
    </mesh>
  );
}
