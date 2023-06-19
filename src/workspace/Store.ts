import { create } from "zustand";
import { z } from "zod";
import { useNotificationStore } from "../singleton/Notification/Store";
import { useRootContextMenuStore } from "../singleton/rootContextMenu/Store";
import { persist } from "zustand/middleware";

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
      // TODO: use `storage` option instead
      // Note: `merge` is not intended to be used for serialization
      merge: (persisted, current) => {
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
