import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import starshipUrl from '../../models/starship.glb?url';

export type CameraView = 'earth' | 'moon' | 'starship';

function Starship() {
  const { scene } = useGLTF(starshipUrl);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 0.55 / size.y;
    clone.scale.multiplyScalar(scale);
    clone.position.copy(center).multiplyScalar(-scale);
    return clone;
  }, [scene]);
  return <primitive object={model} />;
}

function LunarSurface({ position }: { position: THREE.Vector3 }) {
  const [map, bump] = useTexture([
    '/textures/06_moonmap4k.jpg',
    '/textures/07_moonbump4k.jpg',
  ]);
  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  }, [map]);
  return (
    <mesh name="lunar-surface" position={position}>
      <sphereGeometry args={[0.27, 64, 48]} />
      <meshStandardMaterial
        map={map}
        bumpMap={bump}
        bumpScale={0.002}
        roughness={1}
      />
    </mesh>
  );
}

/** Cinematic scene distances: lunar horizon and orbital chase views, not an astronomical scale model. */
export function CameraRig({
  view,
  reducedMotion,
  isPlaying,
}: {
  view: CameraView;
  reducedMotion: boolean;
  isPlaying: boolean;
}) {
  const { camera, size } = useThree();
  const ship = useRef<THREE.Group>(null);
  const orbit = useRef(0);
  const previousView = useRef<CameraView>('earth');
  const savedEarth = useMemo(
    () => ({
      position: new THREE.Vector3(2.6, 1.7, -0.9),
      quaternion: new THREE.Quaternion(),
    }),
    [],
  );
  const vectors = useMemo(() => {
    const radial = new THREE.Vector3(2.6, 1.7, -0.9).normalize();
    const right = new THREE.Vector3()
      .crossVectors(new THREE.Vector3(0, 1, 0), radial)
      .normalize();
    const up = new THREE.Vector3().crossVectors(radial, right).normalize();
    return {
      radial,
      right,
      up,
      modelUp: new THREE.Vector3(0, 1, 0),
      direction: new THREE.Vector3(),
      position: new THREE.Vector3(),
      target: new THREE.Vector3(),
      moon: radial.clone().multiplyScalar(6).addScaledVector(up, -0.273),
    };
  }, []);
  useEffect(() => {
    if (view !== 'earth' && previousView.current === 'earth') {
      savedEarth.position.copy(camera.position);
      savedEarth.quaternion.copy(camera.quaternion);
    } else if (view === 'earth' && previousView.current !== 'earth') {
      camera.position.copy(savedEarth.position);
      camera.quaternion.copy(savedEarth.quaternion);
    }
    previousView.current = view;
  }, [view, camera, savedEarth]);
  useFrame((_, delta) => {
    if (view === 'earth') return;
    const { radial, right, up, direction, position, target } = vectors;
    if (view === 'moon') {
      camera.position.copy(radial).multiplyScalar(6);
      camera.up.copy(up);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (!reducedMotion && isPlaying)
      orbit.current += Math.min(delta, 0.05) * 0.035;
    direction
      .copy(radial)
      .multiplyScalar(Math.cos(orbit.current))
      .addScaledVector(right, Math.sin(orbit.current));
    position.copy(direction).multiplyScalar(2.1).addScaledVector(up, 0.15);
    if (ship.current) {
      ship.current.position.copy(position);
      ship.current.quaternion.setFromUnitVectors(vectors.modelUp, up);
      ship.current.rotateZ(-0.2);
    }
    const distance = Math.max(3.3, (1.7 * size.height) / size.width);
    camera.position
      .copy(position)
      .addScaledVector(direction, distance)
      .addScaledVector(right, 0.75)
      .addScaledVector(up, 0.15);
    camera.up.copy(up);
    target.copy(position).multiplyScalar(0.3);
    camera.lookAt(target);
  });
  useEffect(
    () => () => {
      camera.up.set(0, 1, 0);
    },
    [camera, view],
  );
  return (
    <>
      {view === 'moon' && (
        <Suspense fallback={null}>
          <LunarSurface position={vectors.moon} />
        </Suspense>
      )}
      {view === 'starship' && (
        <group ref={ship} name="tracked-starship">
          <Suspense fallback={null}>
            <Starship />
          </Suspense>
        </group>
      )}
    </>
  );
}
