import React from "react";
import { useGLTF } from "@react-three/drei";

interface StarshipModelProps {
  position: THREE.Vector3;
}

const StarshipModel = ({ position }: StarshipModelProps) => {
  const { scene } = useGLTF("../models/starship.glb");

  const scale = 0.005;
  scene.scale.set(scale, scale, scale);
  scene.rotation.x = Math.PI / 2;
  scene.position.set(position.x, position.y, position.z);
  return <primitive object={scene} />;
};

export default StarshipModel;
