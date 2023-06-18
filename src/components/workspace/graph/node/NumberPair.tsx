import { FC, memo, useState } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";
import { inputStyles, labelStyles } from "./styles";
import { twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";

export const config: NodeConfig = {
  outputs: [
    {
      id: "output-number-pair",
      label: "Number Pair",
      type: NodeEndpointType.NumberPair,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value?: [number, number];
};

const NumberPairNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const [value, setValue] = useState<[number, number]>(data.value ?? [0, 0]);

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Number Pair"
      {...props}
    >
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>X:</label>
        <input
          className={inputStyles}
          type="number"
          value={value[0]}
          onChange={(e) =>
            setValue((state) => [parseInt(e.target.value), state[1]])
          }
        />
        <label className={labelStyles}>Y:</label>
        <input
          className={inputStyles}
          type="number"
          value={value[1]}
          onChange={(e) =>
            setValue((state) => [state[0], parseInt(e.target.value)])
          }
        />
      </div>
    </BaseNode>
  );
};

export default NumberPairNode;
