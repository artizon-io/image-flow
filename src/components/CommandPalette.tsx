import { useEffect, useRef, useState } from "react";
import _Notification, { useNotification } from "./Notification";
import type { NinjaKeys as _NinjaKeys } from "ninja-keys";
import { create } from "zustand";
import "./ninja-keys.css";
import { AngleIcon } from "@radix-ui/react-icons";
import { useLayout, useLayoutStore } from "./layout/LayoutManager";
import { subscribeWithSelector } from "zustand/middleware";

// Fixing the NinjaKeys type
// https://github.com/ssleptsov/ninja-keys#data

// Repo not maintained anymore, so maybe fork in the future

// Nesting is bugged, avoid it for now (use the grouping feature for now)

type NinjaKeys = Omit<_NinjaKeys, "data"> & { data: NinjaAction[] };

type NinjaAction = {
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

const useCommandPaletteStore = create<{
  // Because we cannot control the state of the NinjaKeys element,
  // so we cope with it
  shouldOpen: boolean;
  actions: NinjaKeys["data"];
  showCommandPalette: () => void;
  resetShouldOpen: () => void;
  addAction: (action: NinjaAction) => void;
  addActions: (actions: NinjaAction[]) => void;
}>((set) => ({
  shouldOpen: false,
  actions: [
    // Search
    {
      id: "Advance Filter",
      title: "Advance Filter With Query Syntax",
      // hotkey: "⌘+p",
      section: "Search",
      handler: () => {},
      // https://github.com/ssleptsov/ninja-keys#icons
      // mdIcon: "",
    },
    {
      id: "Manage Columns",
      title: "Reorder/Show/Hide Table Columns",
      section: "Table",
      handler: () => {},
    },
    // Theme
    // {
    //   id: "Light Theme",
    //   title: "Switch to Light Theme",
    //   keywords: "theme",
    //   section: 'Theme',
    //   parent: "Theme",
    //   handler: () => {},
    // },
    // {
    //   id: "Dark Theme",
    //   title: "Switch to Dark Theme",
    //   keywords: "theme",
    //   section: 'Theme',
    //   parent: "Theme",
    //   handler: () => {},
    // },
    // Settings
    {
      id: "Settings",
      title: "Open Settings",
      section: "Settings",
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
    set((state) => ({
      ...state,
      actions: [...state.actions, action],
    }));
  },
  addActions: (actions) => {
    set((state) => ({
      ...state,
      actions: [...state.actions, ...actions],
    }));
  },
}));

// Interactions between stores
// https://github.com/pmndrs/zustand#using-subscribe-with-selector

const layoutActions = Object.entries(useLayoutStore.getState().switchers).map(
  ([name, switcher]) => ({
    id: name,
    title: `Switch to ${name} Layout`,
    section: "Layout",
    // hotkey: "⌘+3",
    handler: switcher,
  })
);

useCommandPaletteStore.getState().addActions(layoutActions);

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
  } = useCommandPaletteStore(
    (state) => state,
    // Only re-render when "shouldOpen" changes from false to true
    // https://github.com/pmndrs/zustand#selecting-multiple-state-slices
    (prev, current) =>
      prev.shouldOpen !== current.shouldOpen &&
      !!current.shouldOpen &&
      // https://github.com/pmndrs/zustand/discussions/1868
      prev.resetShouldOpen !== prev.resetShouldOpen
  );

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

  // @ts-ignore
  return <ninja-keys ref={ninjaKeys} />;
};

export default CommandPalette;
