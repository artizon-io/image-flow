import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ImageIcon,
  Component2Icon,
  ViewVerticalIcon
} from "@radix-ui/react-icons";
import { Layout, useLayout, useLayoutStore } from "./LayoutManager";
import { twJoin } from "tailwind-merge";
import { FC, forwardRef } from "react";
import HelpTooltip from "./HelpTooltip";

const layoutIconMap: Record<
  Layout,
  FC<{
    className?: string;
  }>
> = {
  "Image Feed": ImageIcon,
  "Table Only": Component2Icon,
  "Two Column": ViewVerticalIcon,
};

const navItemConfigs = Object.entries(useLayoutStore.getState().switchers).map(
  ([name, switcher]) => ({
    label: name,
    handler: switcher,
    icon: layoutIconMap[name as Layout],
  })
);

const LayoutNav = () => {
  const layout = useLayoutStore((state) => state.layout);

  return (
    <ToggleGroup.Root
      className="flex flex-row rounded items-stretch overflow-hidden"
      type="single"
      value={layout}
    >
      {navItemConfigs.map((config) => (
        <HelpTooltip description={config.label}>
          <ToggleGroup.Item
            key={config.label}
            className={twJoin(
              "naviconbutton",
              "data-[state=on]:bg-neutral-850 data-[state=on]:text-neutral-300"
            )}
            value={config.label}
            onClick={config.handler}
          >
            <config.icon />
          </ToggleGroup.Item>
        </HelpTooltip>
      ))}
    </ToggleGroup.Root>
  );
};

export default LayoutNav;
