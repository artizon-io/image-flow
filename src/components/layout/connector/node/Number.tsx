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
  outputs: [
    {
      id: "number",
      label: "Number",
    },
  ],
};

export type NodeData = {
  value: number;
};

const NumberNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { value } = data;

  return (
    <BaseNode id={id} data={data} config={config} label="Number" {...props}>
      <p className="font-mono text-neutral-400 text-xs bg-neutral-800 p-1">
        {value}
      </p>
    </BaseNode>
  );
};

export default NumberNode;
