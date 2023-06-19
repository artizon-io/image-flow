import { FC, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeConfig } from "./Base";
import { NodeEndpointType } from "./BaseHandle";
import { textareaStyles } from "./styles";

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
