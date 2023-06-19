import { useEffect, useRef, useState } from "react";
import _Notification, { useNotification } from "./Notification";
import type { NinjaKeys as _NinjaKeys } from "ninja-keys";
import { create } from "zustand";
import "./ninja-keys.css";
import { AngleIcon } from "@radix-ui/react-icons";
import { useWorkspace, useWorkspaceStore } from "../workspace/WorkspaceManager";
import { subscribeWithSelector } from "zustand/middleware";

// Fixing the NinjaKeys type
// https://github.com/ssleptsov/ninja-keys#data

// Repo not maintained anymore, so maybe fork in the future

// Nesting is bugged, avoid it for now (use the grouping feature for now)

// Pressing down to scroll is bugged

// TODO: fork NinjaKeys and fix the bugs

type NinjaKeys = Omit<_NinjaKeys, "data"> & { data: CommandPaletteAction[] };

export type CommandPaletteAction = {
  id: string;
  title: string;
  hotkey?: string;
  mdIcon?: string;
  handler?: () => void;
  icon?: string;
  keywords?: string;
  section?: string;
  // parent?: string;
  // children?: NinjaAction[];
};

export const useCommandPaletteStore = create<{
  // Because we cannot control the state of the NinjaKeys element,
  // so we cope with it
  shouldOpen: boolean;
  actions: NinjaKeys["data"];
  showCommandPalette: () => void;
  resetShouldOpen: () => void;
  addAction: (action: CommandPaletteAction) => void;
  addActions: (actions: CommandPaletteAction[]) => void;
  removeAction: (id: string) => void;
  removeActions: (ids: string[]) => void;
}>((set) => ({
  shouldOpen: false,
  actions: [
    // Settings
    {
      id: "Settings",
      title: "Open Settings",
      section: "Settings",
      // https://github.com/ssleptsov/ninja-keys#icons
      // mdIcon: "",
      handler: () => {},
    },
  ],
  showCommandPalette: () =>
    set((state) => ({
      ...state,
      shouldOpen: true,
    })),
  resetShouldOpen: () =>
    set((state) => ({
      ...state,
      shouldOpen: false,
    })),
  addAction: (action) => {
    console.debug("Adding command palette action", action);
    set((state) => ({
      ...state,
      actions: [...state.actions, action],
    }));
  },
  addActions: (actions) => {
    console.debug("Adding command palette actions", actions);
    set((state) => ({
      ...state,
      actions: [...state.actions, ...actions],
    }));
  },
  removeAction: (id) => {
    set((state) => ({
      ...state,
      actions: state.actions.filter((action) => action.id !== id),
    }));
  },
  removeActions: (ids) => {
    set((state) => ({
      ...state,
      actions: state.actions.filter((action) => !ids.includes(action.id)),
    }));
  },
}));

// Interactions between stores
// https://github.com/pmndrs/zustand#using-subscribe-with-selector

const workspaceActions = Object.entries(
  useWorkspaceStore.getState().switchers
).map(([name, switcher]) => ({
  id: name,
  title: `Switch to ${name} Workspace`,
  section: "Workspace",
  // hotkey: "⌘+3",
  handler: switcher,
}));

useCommandPaletteStore.getState().addActions(workspaceActions);

export const useCommandPalette = () =>
  useCommandPaletteStore((state) => state.showCommandPalette);

const CommandPalette = () => {
  const showNotification = useNotification();

  // Reference to the "ninja-keys" element
  const ninjaKeys = useRef<NinjaKeys>(null);
  const {
    actions: actions,
    shouldOpen,
    resetShouldOpen,
  } = useCommandPaletteStore((state) => state);

  useEffect(() => {
    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fail to load");
      console.error("Ninja Keys fail to load");
      return;
    }
    ninjaKeys.current.data = actions;
    ninjaKeys.current.hideBreadcrumbs = true;
  }, []);

  useEffect(() => {
    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fails");
      return;
    }

    if (shouldOpen) {
      ninjaKeys.current.open();
      resetShouldOpen();
    }
  }, [shouldOpen]);

  useEffect(() => {
    console.debug("Command palette actions updated", actions);

    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fails");
      return;
    }

    ninjaKeys.current.data = actions;
  }, [actions]);

  // @ts-ignore
  return <ninja-keys ref={ninjaKeys} />;
};

export default CommandPalette;
