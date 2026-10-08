import { memo, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TravelLocation } from '../../types/travel';
import { FlightCurve } from '../../utils/globeMath';
import { colorForDate } from '../../utils/yearColors';

interface FlightArcProps {
  from: TravelLocation;
  to: TravelLocation;
  isActive: boolean;
  completed: boolean;
  visible: boolean;
  overview: boolean;
  reducedMotion: boolean;
  isPlaying: boolean;
  onClick: () => void;
}
export const FlightArc = memo(function FlightArc({
  from,
  to,
  isActive,
  completed,
  visible,
  overview,
  reducedMotion,
  isPlaying,
  onClick,
}: FlightArcProps) {
  const resources = useMemo(() => {
    const curve = new FlightCurve(from, to);
    const ground = to.travelMode === 'ground';
    const geometry = new THREE.TubeGeometry(
      curve,
      Math.max(32, Math.ceil(curve.angle * 70)),
      0.0011,
      4,
      false,
    );
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        color: { value: new THREE.Color(colorForDate(to.date)) },
        opacity: { value: 0 },
        highlight: { value: 0 },
        phase: { value: 0 },
        motion: { value: 1 },
        ground: { value: ground ? 1 : 0 },
        dots: { value: Math.max(4, curve.angle * 140) },
      },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv; uniform vec3 color; uniform float opacity,highlight,phase,motion,ground,dots;
        void main(){if(ground>.5 && fract(vUv.x*dots)>.32) discard;
        float d=fract(vUv.x-phase); float dash=smoothstep(.90,.96,d)*(1.-smoothstep(.985,1.,d))*highlight*motion;
        gl_FragColor=vec4(mix(color,vec3(1.),dash*.65),opacity+dash*.8);}`,
    });
    const glow = material.clone();
    glow.vertexShader = `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*.0025,1.);}`;
    glow.fragmentShader = material.fragmentShader.replace(
      'opacity+dash*.8',
      '(opacity+dash*.8)*.13',
    );
    glow.uniforms = material.uniforms;
    return { geometry, material, glow };
  }, [from, to]);
  useEffect(
    () => () => {
      resources.geometry.dispose();
      resources.material.dispose();
      resources.glow.dispose();
    },
    [resources],
  );
  const u = resources.material.uniforms;
  u.opacity.value = isActive ? 0.8 : overview ? 0.48 : completed ? 0.24 : 0.025;
  u.highlight.value = isActive ? 1 : 0;
  u.motion.value = reducedMotion ? 0 : 1;
  useFrame((_, delta) => {
    if (isPlaying && !reducedMotion && isActive)
      u.phase.value = (u.phase.value + Math.min(delta, 0.05) * 0.22) % 1;
  });
  if (!visible) return null;
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh geometry={resources.geometry} material={resources.material} />
      {isActive && (
        <mesh geometry={resources.geometry} material={resources.glow} />
      )}
    </group>
  );
});
