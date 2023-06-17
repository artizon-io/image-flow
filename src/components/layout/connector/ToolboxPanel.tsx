import { FC, PropsWithChildren } from "react";
import * as Menubar from "@radix-ui/react-menubar";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Panel } from "reactflow";
import { twJoin, twMerge } from "tailwind-merge";
import { create } from "zustand";
import { tailwind } from "../../../utils/cntl/tailwind";
import { useConnectorStore } from "./Connector";

const menuStyles = tailwind`min-w-[200px] bg-neutral-900 rounded-md overflow-hidden px-1 py-2 border-neutral-800 border-[1px] flex flex-col`;
const menuItemStyles = tailwind`flex flex-row justify-between items-center rounded-sm hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 border-none hover:border-none px-3 py-1.5 shadow-none hover:outline-none`;
const menuItemLabelStyles = tailwind`text-inherit text-s pointer-events-none border-none`;

// TODO: refactor this with RootContextMenu

const SubMenu: FC<
  PropsWithChildren<{
    itemConfig: MenuItemConfig;
  }>
> = ({ itemConfig }) => {
  if (itemConfig.subItemConfigs)
    return (
      <Menubar.Sub>
        <Menubar.SubTrigger className={menuItemStyles}>
          <p className={menuItemLabelStyles}>{itemConfig.label}</p>
          <ChevronRightIcon className="text-neutral-300" />
        </Menubar.SubTrigger>
        <Menubar.Portal>
          <Menubar.SubContent
            className={menuStyles}
            sideOffset={5}
            alignOffset={-3}
          >
            {itemConfig.subItemConfigs.map((subItem) => (
              <SubMenu key={subItem.label} itemConfig={subItem} />
            ))}
          </Menubar.SubContent>
        </Menubar.Portal>
      </Menubar.Sub>
    );
  else return <MenuItem itemConfig={itemConfig} />;
};

const MenuItem: FC<{ itemConfig: MenuItemConfig }> = ({ itemConfig }) => (
  <Menubar.Item className={menuItemStyles} onClick={itemConfig.handler}>
    <p className={menuItemLabelStyles}>{itemConfig.label}</p>
    <div />
  </Menubar.Item>
);

const Separator = () => <Menubar.Separator className={menuItemStyles} />;

type MenuItemConfig = {
  label: string;
  handler?: () => void;
  subItemConfigs?: MenuItemConfig[];
};

const useConnectorToolboxMenuStore = create<{
  menuItemConfigs: MenuItemConfig[];
  addMenuItemConfig: (menuItemConfig: MenuItemConfig) => void;
  addMenuItemConfigs: (menuItemConfigs: MenuItemConfig[]) => void;
}>((set) => ({
  // TODO: genericaly derive the menu items and handlers
  menuItemConfigs: [
    {
      label: "Add Node",
      subItemConfigs: [
        {
          label: "Renderer",
          subItemConfigs: [
            {
              label: "Automatic 1111",
              handler: () =>
                useConnectorStore.getState().createNode("automatic-1111", {}),
            },
          ],
        },
        {
          label: "Model",
          handler: () =>
            useConnectorStore.getState().createNode("model", {
              modelName: "Dreamshaper",
              modelVersion: "v1",
            }),
        },
        {
          label: "Primitive",
          subItemConfigs: [
            {
              label: "Number",
              handler: () =>
                useConnectorStore.getState().createNode("number", {
                  value: 0.85,
                }),
            },
            {
              label: "Number Pair",
              handler: () =>
                useConnectorStore.getState().createNode("number-pair", {
                  value: [512, 512],
                }),
            },
            {
              label: "String",
              handler: () =>
                useConnectorStore.getState().createNode("string", {
                  value: "Cute cat",
                }),
            },
            {
              label: "String Number Map",
              handler: () =>
                useConnectorStore.getState().createNode("string-number-map", {
                  value: new Map([
                    ["Cute cat", 3],
                    ["8k", 0.85],
                    ["Cartoon", 1],
                  ]),
                }),
            },
          ],
        },
        {
          label: "Lora Number Map",
          handler: () =>
            useConnectorStore.getState().createNode("lora-number-map", {
              value: new Map([["CatLora", 1]]),
            }),
        },
        {
          label: "Output",
          subItemConfigs: [
            {
              label: "Image",
              handler: () =>
                useConnectorStore.getState().createNode("image-output", {}),
            },
            {
              label: "Text",
              handler: () =>
                useConnectorStore.getState().createNode("text-output", {}),
            },
          ],
        },
      ],
    },
  ],
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

const ToolboxPanel: FC<{}> = ({}) => {
  const menuItemConfigs = useConnectorToolboxMenuStore(
    (state) => state.menuItemConfigs
  );

  return (
    <Panel position={"top-left"}>
      <Menubar.Root className="flex flex-row bg-neutral-800 rounded-md overflow-hidden">
        {menuItemConfigs.map((item) =>
          item.subItemConfigs ? (
            <Menubar.Menu key={item.label}>
              <Menubar.Trigger
                className={twMerge(
                  menuItemStyles,
                  "text-neutral-400 hover:text-neutral-300"
                )}
                onClick={item.handler}
              >
                <p className={menuItemLabelStyles}>{item.label}</p>
                <div />
              </Menubar.Trigger>
              <Menubar.Portal>
                <Menubar.Content
                  className={menuStyles}
                  align="start"
                  sideOffset={5}
                  alignOffset={-3}
                >
                  {item.subItemConfigs.map((subItem) => (
                    <SubMenu key={subItem.label} itemConfig={subItem} />
                  ))}
                </Menubar.Content>
              </Menubar.Portal>
            </Menubar.Menu>
          ) : (
            <MenuItem itemConfig={item} />
          )
        )}
      </Menubar.Root>
    </Panel>
  );
};

export default ToolboxPanel;
