import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";

export const config: NodeConfig = {
  outputs: [
    {
      id: "string",
      label: "String",
      type: NodeEndpointType.String,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value: string;
};

const StringNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { value } = data;

  return (
    <BaseNode id={id} data={data} config={config} label="String" {...props}>
      <p className="font-mono text-neutral-400 text-xs bg-neutral-800 p-1">
        {value}
      </p>
    </BaseNode>
  );
};

export default StringNode;
