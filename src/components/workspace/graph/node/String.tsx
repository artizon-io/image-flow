import { FC, memo, useState } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";
import { inputStyles, textareaStyles } from "./styles";
import { twMerge } from "tailwind-merge";

export const config: NodeConfig = {
  outputs: [
    {
      id: "output-string",
      label: "String",
      type: NodeEndpointType.String,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value?: string;
};

const StringNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const [value, setValue] = useState<string>(data.value ?? "");

  return (
    <BaseNode id={id} data={data} config={config} label="String" {...props}>
      <textarea
        className={textareaStyles}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </BaseNode>
  );
};

export default StringNode;
