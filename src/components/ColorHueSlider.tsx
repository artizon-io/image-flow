import * as Slider from "@radix-ui/react-slider";
import { FC } from "react";

const ColorHueSlider: FC<{
  colorHue: number;
  setColorHue: (colorHue: number) => void;
}> = ({ colorHue, setColorHue }) => {
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-[300px] h-5"
      min={0}
      max={360}
      value={[colorHue]}
      step={1}
      onValueChange={(value) => setColorHue(value[0])}
    >
      <Slider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-neutral-300 rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-4 h-4 bg-neutral-300 shadow-none rounded-full hover:bg-neutral-50 focus:outline-none focus:shadow-none"
        aria-label="Volume"
      />
    </Slider.Root>
  );
};

export default ColorHueSlider;
