import React, { FC, PropsWithChildren } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { twJoin } from "tailwind-merge";
import { tailwind } from "../utils/cntl/tailwind";

const menuStyles = tailwind`min-w-[200px] bg-neutral-900 rounded-md overflow-hidden px-3 py-4 border-neutral-700 border-[1px] flex flex-col gap-1`;

const MenuItem: FC<
  PropsWithChildren<{
    itemConfig: MenuItemConfig;
  }>
> = ({ itemConfig }) => {
  const menuItemStyles = tailwind`flex flex-row justify-between items-center rounded-sm hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 hover:outline-none px-3 py-2 shadow-none outline-none`;
  const menuItemLabelStyles = tailwind`text-inherit text-xs`;

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
      <ContextMenu.Item className={twJoin(menuItemStyles, "")}>
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
  hotkey?: string;
  subItemConfigs?: MenuItemConfig[];
};

const menuItemConfigs: MenuItemConfig[] = [
  {
    label: "Switch Layout",
    subItemConfigs: [
      {
        label: "Table Only",
        // hotkey: "⌘+p",
      },
      {
        label: "Image Feed",
        // hotkey: "⌘+p",
      },
      {
        label: "Two Column",
      },
    ],
  },
];

const RightClickContextMenu = () => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        className={twJoin(
          // Show and inset the "box" only in dev mode
          `block border-[1px] absolute border-dashed`,
          import.meta.env.DEV
            ? "inset-10 border-neutral-600"
            : "inset-0 border-transparent"
        )}
      />
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

export default RightClickContextMenu;
