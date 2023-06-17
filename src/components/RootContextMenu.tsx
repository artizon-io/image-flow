import React, { FC, PropsWithChildren, useMemo } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { twJoin } from "tailwind-merge";
import { tailwind } from "../utils/cntl/tailwind";
import { useLayout, useLayoutStore } from "./layout/LayoutManager";
import { create } from "zustand";

const menuStyles = tailwind`min-w-[200px] bg-neutral-900 rounded-md overflow-hidden px-1 py-2 border-neutral-800 border-[1px] flex flex-col`;

const MenuItem: FC<
  PropsWithChildren<{
    itemConfig: MenuItemConfig;
  }>
> = ({ itemConfig }) => {
  const menuItemStyles = tailwind`flex flex-row justify-between items-center rounded-sm hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 hover:outline-none px-3 py-1.5 shadow-none outline-none`;
  const menuItemLabelStyles = tailwind`text-inherit text-s pointer-events-none`;

  if (itemConfig.subItemConfigs)
    return (
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger className={twJoin(menuItemStyles, "")}>
          <div className={twJoin(menuItemLabelStyles, "")}>
            {itemConfig.label}
          </div>
          <ChevronRightIcon className="text-neutral-300" />
        </ContextMenu.SubTrigger>
        <ContextMenu.Portal>
          <ContextMenu.SubContent
            className={twJoin(menuStyles, "")}
            sideOffset={2}
            alignOffset={-5}
          >
            {itemConfig.subItemConfigs.map((subItem) => (
              <MenuItem key={subItem.label} itemConfig={subItem} />
            ))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
    );
  else
    return (
      <ContextMenu.Item
        className={twJoin(menuItemStyles, "")}
        onClick={itemConfig.handler}
      >
        <div className={twJoin(menuItemLabelStyles, "")}>
          {itemConfig.label}
        </div>
        {itemConfig.hotkey ? (
          <kbd className="text-xs text-neutral-300 group-data-[highlighted]:text-neutral-200 group-data-[disabled]:text-neutral-500">
            {itemConfig.hotkey}
          </kbd>
        ) : (
          <span />
        )}
      </ContextMenu.Item>
    );
};

const Separator = () => (
  <ContextMenu.Separator className="h-[1px] bg-neutral-900 m-1" />
);

type MenuItemConfig = {
  label: string;
  handler?: () => void;
  hotkey?: string;
  subItemConfigs?: MenuItemConfig[];
};

const useRootContextMenuStore = create<{
  menuItemConfigs: MenuItemConfig[];
  addMenuItemConfig: (menuItemConfig: MenuItemConfig) => void;
  addMenuItemConfigs: (menuItemConfigs: MenuItemConfig[]) => void;
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
}));

// Interactions between stores
// https://github.com/pmndrs/zustand#using-subscribe-with-selector

const layoutMenuItemConfigs = Object.entries(
  useLayoutStore.getState().switchers
).map(([name, switcher]) => ({
  label: name,
  handler: switcher,
}));

useRootContextMenuStore.getState().addMenuItemConfig({
  label: "Switch Layout",
  subItemConfigs: layoutMenuItemConfigs,
});

const RootContextMenu: FC<PropsWithChildren> = ({ children }) => {
  const menuItemConfigs = useRootContextMenuStore(
    (state) => state.menuItemConfigs
  );

  return (
    <ContextMenu.Root>
      {/* Reason of wrapping the children inside the trigger */}
      {/* https://github.com/radix-ui/primitives/discussions/2216 */}
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={twJoin(menuStyles, "")}>
          {menuItemConfigs.map((item) => (
            <MenuItem key={item.label} itemConfig={item} />
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default RootContextMenu;
