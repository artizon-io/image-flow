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
      id: "number-pair",
      label: "Number Pair",
      type: NodeEndpointType.NumberPair,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value: [number, number];
};

const NumberPairNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const {
    value: [x, y],
  } = data;

  const labelStyles = tailwind`text-neutral-500 font-medium text-s`;
  const valueStyles = tailwind`text-neutral-300 font-normal text-s`;

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Number Pair"
      {...props}
    >
      <div className="grid grid-cols-2 gap-x-2">
        <h3 className={labelStyles}>X:</h3>
        <h3 className={valueStyles}>{x}</h3>
        <p className={labelStyles}>Y:</p>
        <p className={valueStyles}>{y}</p>
      </div>
    </BaseNode>
  );
};

export default NumberPairNode;
