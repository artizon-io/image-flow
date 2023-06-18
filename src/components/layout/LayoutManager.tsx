import { FC, useEffect, useState } from "react";
import { create } from "zustand";
import { tailwind } from "../../utils/cntl/tailwind";
import { twJoin } from "tailwind-merge";
import Table from "../Table";
import useImages from "../../hooks/useImages";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import ScrollArea from "../ScrollArea";
import { Masonry, RenderComponentProps } from "masonic";
import Connector from "./connector/Connector";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { useNotificationStore } from "../Notification";

// TODO: separate the concept of "workspace" from "layout"

export const layouts = [
  "Two Column",
  "Table Only",
  "Image Feed",
  "Connector",
] as const;

export type Layout = (typeof layouts)[number];

export const useLayoutStore = create<{
  layout: Layout;
  switchLayout: (layout: Layout) => void;
  switchers: Record<Layout, () => void>;
}>()(
  persist(
    (set, get) => ({
      layout: "Two Column",
      switchLayout: (layout: Layout) =>
        set((state) => ({ ...state, layout: layout })),
      // Dict comprehension in JS
      // https://stackoverflow.com/questions/11068247/in-javascript-a-dictionary-comprehension-or-an-object-map
      switchers: Object.fromEntries(
        layouts.map((w) => [w, () => get().switchLayout(w)])
      ) as Record<Layout, () => void>,
    }),
    {
      name: "layout-storage",
      partialize: (state) => ({ layout: state.layout }),
      // Note: `merge` is not intended to be used for serialization
      merge: (persisted, current) => {
        console.debug("Merging Layout from local storage", persisted, current);

        if (!persisted) return current;

        const parseResult = z
          .object({
            layout: z.enum(layouts),
          })
          .safeParse(persisted);

        if (!parseResult.success) {
          useNotificationStore
            .getState()
            .showNotification(
              "Warning",
              "Fail to load current layout from local storage."
            );
          console.error(
            "Fail to parse current Layout from local storage",
            parseResult.error.issues
          );
          return current;
        }

        return { ...current, layout: parseResult.data.layout };
      },
    }
  )
);

export const useLayout = () => useLayoutStore((state) => state.switchers);

// TODO: memorise table so it doesn't get rerendered when layout switched

const LayoutManager: FC<{}> = () => {
  const layout = useLayoutStore((state) => state.layout);

  useEffect(() => {
    console.log(`Layout changed to ${layout}`);
  }, [layout]);

  const containerStyles = tailwind`w-full h-full`;

  if (layout === "Two Column") {
    return <TwoColumn className={containerStyles} />;
  } else if (layout === "Image Feed") {
    return <ImageFeed className={containerStyles} />;
  } else if (layout === "Table Only") {
    return <TableOnly className={containerStyles} />;
  } else if (layout === "Connector") {
    return <Connector className={containerStyles} />;
  } else {
    // TODO: throw error and provide fallback UI
    return null;
  }
};

const TwoColumn: FC<{ className: string }> = ({ className }) => {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className={twJoin(className, "grid grid-cols-2 gap-2")}>
      <ScrollArea>
        <Table setImage={setImage} />
      </ScrollArea>
      <div className="flex justify-center items-center bg-neutral-900">
        {image ? (
          // Convert to something that is loadable by system web view
          <img src={convertFileSrc(image)} className="" />
        ) : (
          <p className="text-neutral-500">No Image Selected</p>
        )}
      </div>
    </div>
  );
};

const TableOnly: FC<{ className: string }> = ({ className }) => {
  return (
    <div className={twJoin(className, "grid")}>
      <ScrollArea>
        <Table />
      </ScrollArea>
    </div>
  );
};

const ImageFeed: FC<{ className: string }> = ({ className }) => {
  const images = useImages();

  if (images.length === 0)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-neutral-500">Cannot locate any images</p>
      </div>
    );

  return (
    <ScrollArea>
      <Masonry
        // TODO: use a better key
        items={images.map((image, index) => ({
          id: index,
          image,
        }))}
        render={ImageFeedImage}
        // Grid cell spacing
        columnGutter={8}
        // Column min width
        columnWidth={300}
        // Pre-renders 5 windows worth of content
        overscanBy={10}
      />
    </ScrollArea>
  );
};

const ImageFeedImage: FC<
  RenderComponentProps<{
    id: number;
    image: string;
  }>
> = ({ index, data: { id, image }, width }) => {
  return (
    <div className="rounded-md overflow-hidden">
      <img
        src={convertFileSrc(image)}
        className="hover:scale-105 transition-transform cursor-pointer"
      />
    </div>
  );
};

export default LayoutManager;
