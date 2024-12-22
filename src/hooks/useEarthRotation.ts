import { useState, useEffect } from 'react';

export function useEarthRotation(speed: number = 0.001) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setRotation(prev => (prev + speed) % (Math.PI * 2));
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  return { rotation, setRotation };
}