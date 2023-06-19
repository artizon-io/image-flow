import { FC, useEffect } from "react";
import { twJoin } from "tailwind-merge";
import Table from "./table/Table";
import useImages from "../hooks/useImages";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import ScrollArea from "../components/ScrollArea";
import { Masonry, RenderComponentProps } from "masonic";
import Graph from "./graph";
import { useWorkspaceStore } from "./Store";
import { useRootContextMenuStore } from "../singleton/rootContextMenu/Store";
import { tailwind } from "../utils/tailwind";
import { useCommandPaletteStore } from "../singleton/commandPalette/Store";

const containerStyles = tailwind`w-full h-full`;

const WorkspaceManager: FC<{}> = () => {
  const { workspace, switchers } = useWorkspaceStore((state) => state);

  const { addCommandPaletteActions, removeCommandPaletteActions } =
    useCommandPaletteStore((state) => ({
      addCommandPaletteActions: state.addActions,
      removeCommandPaletteActions: state.removeActions,
    }));

  useEffect(() => {
    const commandPaletteActions = Object.entries(switchers).map(
      ([name, switcher]) => ({
        id: name,
        title: `Switch to ${name} Workspace`,
        section: "Workspace",
        // hotkey: "⌘+3",
        handler: switcher,
      })
    );

    addCommandPaletteActions(commandPaletteActions);

    return () =>
      removeCommandPaletteActions(
        Object.entries(switchers).map(([name, _]) => name)
      );
  }, []);

  const { addRootContextMenuItem, removeRootContextMenuItem } =
    useRootContextMenuStore((state) => ({
      addRootContextMenuItem: state.addMenuItemConfig,
      removeRootContextMenuItem: state.removeMenuItemConfig,
    }));

  useEffect(() => {
    const menuItemConfigs = Object.entries(switchers).map(
      ([name, switcher]) => ({
        label: name,
        handler: switcher,
      })
    );

    addRootContextMenuItem({
      label: "Switch Workspace",
      subItemConfigs: menuItemConfigs,
    });

    return () => removeRootContextMenuItem("Switch Workspace");
  }, []);

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
