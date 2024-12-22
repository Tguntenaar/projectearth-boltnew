import React from "react";
import { Slider } from "./ui/slider";
import { useSpeed } from "../hooks/useSpeed";
import { scaleValue } from "../utils/coordinates";
import { useEarthRotation } from "../hooks/useEarthRotation";
export function Controls() {
  const { setSpeed } = useSpeed();
  const { setRotation } = useEarthRotation();
  const [sliderValue, setSliderValue] = React.useState(50);
  const [rotationSliderValue, setRotationSliderValue] = React.useState(50);

  const changeSpeed = React.useCallback(
    (value: number[]) => {
      setSliderValue(value[0]);
      const scaledValue = scaleValue(value[0], 0, 100, 0.001, 0.02);
      setSpeed(scaledValue);
    },
    [setSpeed]
  );

  const changeRotation = React.useCallback(
    (value: number[]) => {
      setRotationSliderValue(value[0]);
      const scaledValue = scaleValue(value[0], 0, 100, 0.0005, 0.02);
      setRotation(scaledValue);
    },
    [setRotation]
  );

  React.useEffect(() => {
    changeSpeed([50]);
    changeRotation([0]);
  }, [changeSpeed, changeRotation]);

  return (
    <div className="absolute w-[20%] bottom-4 right-4 bg-blue-950/30 backdrop-blur-sm rounded p-4 py-6 text-white shadow-lg shadow-blue-500/50 space-y-4">
      <h2 className="text-xl font-bold mb-4">Controls</h2>
      <div>Speed: {sliderValue}</div>
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        className="w-[80%]"
        onValueChange={(value) => changeSpeed(value)}
      />
      <div>Rotation: {rotationSliderValue}</div>
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        className="w-[80%]"
        onValueChange={(value) => changeRotation(value)}
      />
    </div>
  );
}
