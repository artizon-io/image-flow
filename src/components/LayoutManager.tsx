import { FC, useEffect, useState } from "react";
import { create } from "zustand";
import { tailwind } from "../utils/cntl/tailwind";
import { twJoin } from "tailwind-merge";
import Table from "./Table";
import ScrollArea from "./ScrollArea";
import RootContextMenu from "./RootContextMenu";

export const layouts = ["Two Column", "Table Only", "Image Feed"] as const;

type Layout = (typeof layouts)[number];

export const useLayoutStore = create<{
  layout: Layout;
  switchLayout: (layout: Layout) => void;
  switchers: Record<Layout, () => void>;
}>((set, get) => ({
  layout: "Two Column",
  switchLayout: (layout: Layout) =>
    set((state) => ({ ...state, layout: layout })),
  // Dict comprehension in JS
  // https://stackoverflow.com/questions/11068247/in-javascript-a-dictionary-comprehension-or-an-object-map
  switchers: Object.fromEntries(
    layouts.map((w) => [w, () => get().switchLayout(w)])
  ) as Record<Layout, () => void>,
}));

export const useLayout = () => useLayoutStore((state) => state.switchers);

const LayoutManager: FC<{}> = () => {
  const layout = useLayoutStore((state) => state.layout);

  useEffect(() => {
    console.log(`Layout changed to ${layout}`);
  }, [layout]);

  const containerStyles = tailwind`w-full h-full`;

  if (layout === "Two Column") {
    return <TwoColumn className={containerStyles} />;
  } else if (layout === "Image Feed") {
    return <div className={twJoin(containerStyles, "")}></div>;
  } else if (layout === "Table Only") {
    return <TableOnly className={containerStyles} />;
  } else {
    // TODO: throw error and provide fallback UI
    return null;
  }
};

const TwoColumn: FC<{ className: string }> = ({ className }) => {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className={twJoin(className, "grid grid-cols-2 bg-neutral-800 gap-2")}>
      <ScrollArea>
        <Table setImage={setImage} />
      </ScrollArea>
      <div className="flex justify-center items-center bg-neutral-900">
        {image ? (
          <img src={image} className="" />
        ) : (
          <p className="text-neutral-500">No Image Selected</p>
        )}
      </div>
    </div>
  );
};

const TableOnly: FC<{ className: string }> = ({ className }) => {
  return (
    <div className={twJoin(className, "")}>
      <ScrollArea>
        <Table />
      </ScrollArea>
    </div>
  );
};

export default LayoutManager;
