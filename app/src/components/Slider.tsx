import * as Slider from "@radix-ui/react-slider";
import { ComponentProps, FC } from "react";

const CustomSlider: FC<
  // TODO: TS can be better
  Omit<ComponentProps<typeof Slider.Root>, "value" | "setValue"> & {
    value: number;
    setValue: (value: number) => void;
  }
> = ({ value: value, setValue: setValue, ...props }) => {
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-[300px] h-5"
      value={[value]}
      step={1}
      onValueChange={(value) => setValue(value[0])}
      {...props}
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

export default CustomSlider;
