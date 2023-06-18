import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";
import { tailwind } from "../../../../utils/cntl/tailwind";

export const config: NodeConfig = {
  outputs: [
    {
      id: "string-number-map",
      label: "String Number Map",
      type: NodeEndpointType.StringNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value: Map<string, number>;
};

const StringNumberMapNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const { value: values } = data;

  const labelStyles = tailwind`text-neutral-500 font-medium text-s`;
  const valueStyles = tailwind`text-neutral-300 font-normal text-s`;

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="String Number Map"
      {...props}
    >
      <div className="grid grid-cols-1 gap-2">
        {[...values].map(([key, value]) => (
          <div className="" key={key}>
            <p className={labelStyles}>{key}</p>
            <p className={valueStyles}>{value}</p>
          </div>
        ))}
      </div>
    </BaseNode>
  );
};

export default StringNumberMapNode;
