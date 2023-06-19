import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ImageIcon, Component2Icon, CommitIcon } from "@radix-ui/react-icons";
import { twJoin } from "tailwind-merge";
import { FC, forwardRef, useMemo } from "react";
import HelpTooltip from "../components/HelpTooltip";
import { Workspace, useWorkspaceStore } from "./Store";

const workspaceIconMap: Record<
  Workspace,
  FC<{
    className?: string;
  }>
> = {
  "Image Feed": ImageIcon,
  Table: Component2Icon,
  Graph: CommitIcon,
};

const WorkspaceNav = () => {
  const workspace = useWorkspaceStore((state) => state.workspace);

  const switchers = useWorkspaceStore((state) => state.switchers);
  const navItemConfigs = useMemo(
    () =>
      Object.entries(switchers).map(([name, switcher]) => ({
        label: name,
        handler: switcher,
        icon: workspaceIconMap[name as Workspace],
      })),
    [switchers]
  );

  return (
    <ToggleGroup.Root
      className="flex flex-row rounded items-stretch overflow-hidden"
      type="single"
      value={workspace}
    >
      {navItemConfigs.map((config) => (
        // TODO: figure out why wrapping the toggle group item
        // with helper tooltip won't trigger the state update of
        // the toggle group item
        <ToggleGroup.Item
          key={config.label}
          className={twJoin(
            "naviconbutton",
            "data-[state=on]:bg-neutral-850 data-[state=on]:text-neutral-300"
          )}
          value={config.label}
          onClick={config.handler}
        >
          <HelpTooltip description={config.label}>
            <config.icon />
          </HelpTooltip>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};

export default WorkspaceNav;
