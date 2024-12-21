import React from "react";
import { CircleDashed } from "lucide-react";
import { Slider } from "./ui/slider";
import { useSpeed } from "../hooks/useSpeed";
import { scaleValue } from "../utils/coordinates";
export function Controls() {
  const { setSpeed } = useSpeed();

  const changeSpeed = (value: number[]) => {
    const scaledValue = scaleValue(value[0], 0, 100, 0.001, 0.02);
    setSpeed(scaledValue);
  };

  changeSpeed([50]);

  return (
    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Controls</h2>
      <CircleDashed />
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        className={"w-[60%]"}
        onValueChange={(value) => changeSpeed(value)}
      />
    </div>
  );
}
