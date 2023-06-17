import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode from "./Base";

const config = {
  inputs: [
    {
      id: "text",
      label: "Text",
    },
  ],
};

export type NodeData = {};

const TextOutputNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Text Output"
      {...props}
    ></BaseNode>
  );
};

export default TextOutputNode;
