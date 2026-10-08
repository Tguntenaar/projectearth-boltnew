import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TravelLocation } from '../../types/travel';
import { FlightCurve, easeFlight } from '../../utils/globeMath';
import { PlaybackMotion } from '../../hooks/useTravelPlayback';

interface TravelingAircraftProps {
  from: TravelLocation;
  to: TravelLocation;
  motion: React.MutableRefObject<PlaybackMotion>;
  reducedMotion: boolean;
  color: string;
}
// Model convention: nose +Z, starboard +X, cabin roof +Y.
function foil(points: number[][], thickness: number) {
  const shape = new THREE.Shape(
    points.map(([x, z]) => new THREE.Vector2(x, z)),
  );
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
  });
  geometry.rotateX(Math.PI / 2);
  return geometry;
}
function makeAirliner() {
  const fuselage = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0, -0.038),
      new THREE.Vector2(0.003, -0.03),
      new THREE.Vector2(0.0056, -0.014),
      new THREE.Vector2(0.006, 0.019),
      new THREE.Vector2(0.0046, 0.029),
      new THREE.Vector2(0.0025, 0.035),
      new THREE.Vector2(0, 0.039),
    ],
    10,
  );
  fuselage.rotateX(Math.PI / 2);
  const wings = foil(
    [
      [0, 0.012],
      [0.01, 0.006],
      [0.047, -0.015],
      [0.047, -0.02],
      [0.014, -0.011],
      [0, -0.008],
      [-0.014, -0.011],
      [-0.047, -0.02],
      [-0.047, -0.015],
      [-0.01, 0.006],
    ],
    0.0016,
  );
  const tail = foil(
    [
      [0, -0.019],
      [0.019, -0.032],
      [0.019, -0.037],
      [0, -0.031],
      [-0.019, -0.037],
      [-0.019, -0.032],
    ],
    0.0012,
  );
  const fin = foil(
    [
      [0, -0.018],
      [0.016, -0.032],
      [0.016, -0.038],
      [0, -0.032],
    ],
    0.0015,
  );
  fin.rotateZ(Math.PI / 2);
  const engine = new THREE.CylinderGeometry(0.0033, 0.0028, 0.014, 8);
  engine.rotateX(Math.PI / 2);
  const cockpit = new THREE.SphereGeometry(1, 8, 6);
  return { fuselage, wings, tail, fin, engine, cockpit };
}
const TRAIL_SAMPLES = 24;
export function TravelingAircraft({
  from,
  to,
  motion,
  reducedMotion,
  color,
}: TravelingAircraftProps) {
  const plane = useRef<THREE.Group>(null);
  const trailMesh = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const path = new FlightCurve(from, to);
    path.updateArcLengths();
    return path;
  }, [from, to]);
  const model = useMemo(makeAirliner, []);
  const modelScale = THREE.MathUtils.clamp(curve.getLength() / 0.6, 0.45, 1);
  const scratch = useMemo(
    () => ({
      position: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      matrix: new THREE.Matrix4(),
      roll: new THREE.Quaternion(),
      axis: new THREE.Vector3(0, 0, 1),
    }),
    [],
  );
  const trail = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array((TRAIL_SAMPLES + 1) * 6);
    const uv = new Float32Array((TRAIL_SAMPLES + 1) * 4);
    const indices = [];
    for (let i = 0; i <= TRAIL_SAMPLES; i++) {
      uv.set([i / TRAIL_SAMPLES, 0, i / TRAIL_SAMPLES, 1], i * 4);
      if (i < TRAIL_SAMPLES) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: { color: { value: new THREE.Color(color) } },
      vertexShader:
        'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:
        'varying vec2 vUv; uniform vec3 color; void main(){float edge=1.-abs(vUv.y*2.-1.); gl_FragColor=vec4(mix(color,vec3(1.),.65),vUv.x*vUv.x*edge*.7);}',
    });
    return { geometry, material, positions };
  }, []);
  useEffect(() => {
    trail.material.uniforms.color.value.set(color);
  }, [color, trail]);
  useEffect(
    () => () => {
      Object.values(model).forEach((g) => g.dispose());
      trail.geometry.dispose();
      trail.material.dispose();
    },
    [model, trail],
  );
  useFrame(() => {
    if (!plane.current || !trailMesh.current) return;
    const t = easeFlight(motion.current.progress);
    const { position, forward, right, up, matrix, roll, axis } = scratch;
    curve.getPointAt(t, position);
    curve.getTangentAt(t, forward);
    up.copy(position).normalize();
    right.crossVectors(up, forward).normalize();
    up.crossVectors(forward, right).normalize();
    matrix.makeBasis(right, up, forward);
    plane.current.position.copy(position);
    plane.current.quaternion.setFromRotationMatrix(matrix);
    // A modest coordinated bank, tapering to level at both airports.
    const bank = reducedMotion
      ? 0
      : Math.sin(Math.PI * t) *
        Math.sin(2 * Math.PI * t) *
        Math.min(0.12, curve.angle * 0.14);
    plane.current.quaternion.multiply(roll.setFromAxisAngle(axis, bank));
    const trailHead = Math.max(
      0,
      t - (0.034 * modelScale) / Math.max(curve.getLength(), 1e-6),
    );
    trailMesh.current.visible =
      !reducedMotion && trailHead > 0.001 && t < 0.999;
    if (!trailMesh.current.visible) return;
    // 1.8% of the arc length; no new arrays, vectors or materials per frame.
    for (let i = 0; i <= TRAIL_SAMPLES; i++) {
      const f = i / TRAIL_SAMPLES;
      const sample = Math.max(0, trailHead - 0.018 * (1 - f));
      curve.getPointAt(sample, position);
      curve.getTangentAt(sample, forward);
      right
        .crossVectors(position, forward)
        .normalize()
        .multiplyScalar(0.0018 * f);
      const offset = i * 6;
      trail.positions[offset] = position.x - right.x;
      trail.positions[offset + 1] = position.y - right.y;
      trail.positions[offset + 2] = position.z - right.z;
      trail.positions[offset + 3] = position.x + right.x;
      trail.positions[offset + 4] = position.y + right.y;
      trail.positions[offset + 5] = position.z + right.z;
    }
    trail.geometry.attributes.position.needsUpdate = true;
  });
  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: '#edf5ff',
        emissive: '#9ac8ef',
        emissiveIntensity: 0.24,
        metalness: 0.3,
        roughness: 0.38,
        flatShading: true,
      }),
      accent: new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        metalness: 0.25,
        roughness: 0.4,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: '#15354e',
        emissive: '#337eac',
        emissiveIntensity: 0.2,
        metalness: 0.65,
        roughness: 0.2,
      }),
    }),
    [color],
  );
  useEffect(() => {
    materials.body.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float rim = pow(1.0 - max(dot(normal, normalize(vViewPosition)), 0.0), 3.0);
        totalEmissiveRadiance += vec3(0.32, 0.58, 0.85) * rim * 0.35;`,
      );
    };
    materials.body.needsUpdate = true;
  }, [materials]);
  useEffect(
    () => () => Object.values(materials).forEach((m) => m.dispose()),
    [materials],
  );
  return (
    <>
      <mesh
        ref={trailMesh}
        geometry={trail.geometry}
        material={trail.material}
        frustumCulled={false}
      />
      <group name="aircraft" ref={plane} scale={modelScale}>
        <mesh geometry={model.fuselage} material={materials.body} />
        <mesh geometry={model.wings} material={materials.body} />
        <mesh geometry={model.tail} material={materials.body} />
        <mesh geometry={model.fin} material={materials.accent} />
        <mesh
          geometry={model.engine}
          material={materials.body}
          position={[-0.016, -0.004, 0.001]}
        />
        <mesh
          geometry={model.engine}
          material={materials.body}
          position={[0.016, -0.004, 0.001]}
        />
        <mesh
          geometry={model.cockpit}
          material={materials.glass}
          position={[0, 0.0045, 0.027]}
          scale={[0.004, 0.0018, 0.004]}
        />
      </group>
    </>
  );
}
