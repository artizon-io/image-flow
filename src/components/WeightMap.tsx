import { FC, PropsWithChildren } from "react";

const WeightMap: FC<
  PropsWithChildren & {
    weightMap: WeightMap;
  }
> = ({ weightMap, ...props }) => {
  if (weightMap.size === 0) {
    return <>None</>;
  }

  // For how to map over Map
  // https://stackoverflow.com/questions/57642099/how-to-use-map-over-map-keys-in-javascript

  return (
    <div className="flex flex-row flex-wrap gap-y-2 gap-x-4 min-w-25">
      {...Array.from(weightMap.keys()).map((key) => (
        <button
          key={key}
          className="text-neutral-200 font-light text-sm px-2 py-0.5 rounded-md bg-neutral-700 hover:bg-neutral-600 hover:border-neutral-500"
        >
          {key}:{weightMap.get(key)}
        </button>
      ))}
    </div>
  );
};

export default WeightMap;
