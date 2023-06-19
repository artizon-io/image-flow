import { FC, useEffect } from "react";
import Table from "./table";
import Graph from "./graph";
import { useWorkspaceStore } from "./Store";
import { useRootContextMenuStore } from "../singleton/rootContextMenu/Store";
import { tailwind } from "../utils/tailwind";
import { useCommandPaletteStore } from "../singleton/commandPalette/Store";
import ImageFeed from "./imageFeed";

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
    return <Table className={containerStyles} />;
  } else if (workspace === "Graph") {
    return <Graph className={containerStyles} />;
  } else {
    // TODO: throw error and provide fallback UI
    return null;
  }
};

export default WorkspaceManager;
