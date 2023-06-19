import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeConfig } from "./Base";
import { NodeEndpointType } from "./BaseHandle";
import { textareaStyles } from "./styles";

export const config: NodeConfig = {
  inputs: [
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
  value?: string;
};

const TextOutputNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { value } = data;

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="String Output"
      {...props}
    >
      <textarea
        value={value ?? "No Output"}
        className={textareaStyles}
        readOnly
      />
    </BaseNode>
  );
};

export default TextOutputNode;
