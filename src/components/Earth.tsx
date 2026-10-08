import { useEffect } from 'react';
import { SRGBColorSpace } from 'three';
import { useTexture } from '@react-three/drei';

export function Earth() {
  const [colorMap, bumpMap, specularMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png',
  ]);

  useEffect(() => {
    colorMap.colorSpace = SRGBColorSpace;
    colorMap.needsUpdate = true;
  }, [colorMap]);

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.008}
        specularMap={specularMap}
        shininess={12}
        specular="#35495e"
      />
    </mesh>
  );
}
