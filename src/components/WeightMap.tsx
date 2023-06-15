import { FC, PropsWithChildren, useMemo } from "react";

const THRESHOLD = 3;

const WeightMap: FC<
  PropsWithChildren & {
    weightMap: WeightMap;
    colorHue: number;
  }
> = ({ weightMap, colorHue, ...props }) => {
  if (weightMap.size === 0) {
    return <>None</>;
  }

  const highestWeight = useMemo(
    () => Math.max(...weightMap.values(), THRESHOLD),
    // TODO: can lead to performance issue?
    [weightMap]
  );

  // For how to map over Map
  // https://stackoverflow.com/questions/57642099/how-to-use-map-over-map-keys-in-javascript

  return (
    <div className="flex flex-row flex-wrap gap-y-2 gap-x-2 min-w-25">
      {...Array.from(weightMap.keys()).map((key) => (
        <button
          key={key}
          className="text-neutral-200 font-light text-sm px-2 py-0.5 rounded-md shadow-none hover:border-none border-none"
          style={{
            backgroundColor: `hsl(${colorHue} ${Math.round(
              (weightMap.get(key)! / highestWeight) * 100
            )}% 15%)`,
          }}
        >
          {key}:{weightMap.get(key)}
        </button>
      ))}
    </div>
  );
};

export default WeightMap;
