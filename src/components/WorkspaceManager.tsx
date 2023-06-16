import { FC, useState } from "react";
import { create } from "zustand";
import { tailwind } from "../utils/cntl/tailwind";
import { twJoin } from "tailwind-merge";
import Table from "./Table";
import ScrollArea from "./ScrollArea";
import RightClickContextMenu from "./RightClickContextMenu";

enum Workspace {
  TwoColumn = "Two Column",
  ImageFeed = "Image Feed",
  TableOnly = "Table Only",
}

const useWorkspaceStore = create<{
  workspace: Workspace;
  switchWorkspace: (workspace: Workspace) => void;
}>((set) => ({
  workspace: Workspace.TwoColumn,
  switchWorkspace: (workspace: Workspace) =>
    set((state) => ({ ...state, workspace })),
}));

export const useWorkspace = () =>
  useWorkspaceStore(
    (state) => ({
      // TODO: make it more DRY?
      [Workspace.TwoColumn]: state.switchWorkspace(Workspace.TwoColumn),
      [Workspace.ImageFeed]: state.switchWorkspace(Workspace.ImageFeed),
      [Workspace.TableOnly]: state.switchWorkspace(Workspace.TableOnly),
    }),
    (prevState, currentState) => false
  );

const WorkspaceManager: FC<{}> = () => {
  const workspace = useWorkspaceStore((state) => state.workspace);

  const containerStyles = tailwind`w-full h-full`;

  if (workspace === Workspace.TwoColumn) {
    return <TwoColumn className={containerStyles} />;
  } else if (workspace === Workspace.ImageFeed) {
    return <div className={twJoin(containerStyles, "")}></div>;
  } else if (workspace === Workspace.TableOnly) {
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

export default WorkspaceManager;
