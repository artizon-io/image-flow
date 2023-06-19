import { FC, useEffect, useState } from "react";
import { create } from "zustand";
import { twJoin } from "tailwind-merge";
import Table from "./table/Table";
import useImages from "../../hooks/useImages";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import ScrollArea from "../ScrollArea";
import { Masonry, RenderComponentProps } from "masonic";
import Graph from "./graph";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { useNotificationStore } from "../singleton/Notification/Store";
import { useRootContextMenuStore } from "../singleton/rootContextMenu/Store";

export const workspaces = ["Table", "Image Feed", "Graph"] as const;

export type Workspace = (typeof workspaces)[number];

export const useWorkspaceStore = create<{
  workspace: Workspace;
  switchWorkspace: (workspace: Workspace) => void;
  switchers: Record<Workspace, () => void>;
}>()(
  persist(
    (set, get) => ({
      workspace: "Table",
      switchWorkspace: (workspace: Workspace) =>
        set((state) => ({ ...state, workspace: workspace })),
      // Dict comprehension in JS
      // https://stackoverflow.com/questions/11068247/in-javascript-a-dictionary-comprehension-or-an-object-map
      switchers: Object.fromEntries(
        workspaces.map((w) => [w, () => get().switchWorkspace(w)])
      ) as Record<Workspace, () => void>,
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({ workspace: state.workspace }),
      // Note: `merge` is not intended to be used for serialization
      merge: (persisted, current) => {
        console.debug(
          "Merging current Workspace from local storage",
          persisted,
          current
        );

        if (!persisted) return current;

        const parseResult = z
          .object({
            workspace: z.enum(workspaces),
          })
          .safeParse(persisted);

        if (!parseResult.success) {
          useNotificationStore
            .getState()
            .showNotification(
              "Warning",
              "Fail to load current workspace from local storage."
            );
          console.error(
            "Fail to parse current workspace from local storage",
            parseResult.error.issues
          );
          return current;
        }

        return { ...current, workspace: parseResult.data.workspace };
      },
    }
  )
);

export const useWorkspace = () => useWorkspaceStore((state) => state.switchers);

// Interactions between stores
// https://github.com/pmndrs/zustand#using-subscribe-with-selector

const workspaceMenuItemConfigs = Object.entries(
  useWorkspaceStore.getState().switchers
).map(([name, switcher]) => ({
  label: name,
  handler: switcher,
}));

useRootContextMenuStore.getState().addMenuItemConfig({
  label: "Switch Workspace",
  subItemConfigs: workspaceMenuItemConfigs,
});

// TODO: memorise table so it doesn't get rerendered when workspace switched

const WorkspaceManager: FC<{}> = () => {
  const workspace = useWorkspaceStore((state) => state.workspace);

  useEffect(() => {
    console.log(`Workspace changed to ${workspace}`);
  }, [workspace]);

  const containerStyles = "w-full h-full";

  if (workspace === "Image Feed") {
    return <ImageFeed className={containerStyles} />;
  } else if (workspace === "Table") {
    return <TableOnly className={containerStyles} />;
  } else if (workspace === "Graph") {
    return <Graph className={containerStyles} />;
  } else {
    // TODO: throw error and provide fallback UI
    return null;
  }
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

export default WorkspaceManager;
