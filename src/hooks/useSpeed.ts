import { useState, useEffect } from 'react';

export function useSpeed(initialSpeed = 0.01) {
  const [speed, setSpeed] = useState(initialSpeed);

  useEffect(() => {
    // Example side effect: log speed changes
    console.log(`Speed changed to: ${speed}`);
  }, [speed]);

  return { speed, setSpeed };
}