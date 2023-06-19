import { create } from "zustand";

export type MenuItemConfig = {
  label: string;
  handler?: () => void;
  hotkey?: string;
  subItemConfigs?: MenuItemConfig[];
};

export const useRootContextMenuStore = create<{
  menuItemConfigs: MenuItemConfig[];
  addMenuItemConfig: (menuItemConfig: MenuItemConfig) => void;
  addMenuItemConfigs: (menuItemConfigs: MenuItemConfig[]) => void;
  removeMenuItemConfig: (label: string) => void;
  removeMenuItemConfigs: (labels: string[]) => void;
}>((set) => ({
  menuItemConfigs: [],
  addMenuItemConfig: (menuItemConfig) =>
    set((state) => ({
      ...state,
      menuItemConfigs: [...state.menuItemConfigs, menuItemConfig],
    })),
  addMenuItemConfigs: (menuItemConfigs) =>
    set((state) => ({
      ...state,
      menuItemConfigs: [...state.menuItemConfigs, ...menuItemConfigs],
    })),
  removeMenuItemConfig: (label) =>
    set((state) => ({
      ...state,
      menuItemConfigs: state.menuItemConfigs.filter(
        (item) => item.label !== label
      ),
    })),
  removeMenuItemConfigs: (labels) =>
    set((state) => ({
      ...state,
      menuItemConfigs: state.menuItemConfigs.filter(
        (item) => !labels.includes(item.label)
      ),
    })),
}));

if (import.meta.env.DEV)
  useRootContextMenuStore.getState().addMenuItemConfig({
    label: "Reload App",
    handler: () => window.location.reload(),
  });
