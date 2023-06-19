import { FC, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeConfig } from "./Base";
import { NodeEndpointType } from "./BaseHandle";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";

export const config: NodeConfig = {
  outputs: [
    {
      id: "lora-number-map",
      label: "Lora Number Map",
      type: NodeEndpointType.LoraNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value?: LoraMap;
};

const LoraNumberMap: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const [values, setValues] = useState<LoraMap>(data.value ?? new Map());

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Lora Number Map"
      {...props}
    >
      <div className={twMerge(twoColumnGridStyles, "gap-x-1 gap-y-2")}>
        {/* TODO: find a better key */}
        {[...values].map(([lora, number], index) => (
          <Item
            key={index}
            lora={lora}
            number={number}
            setLora={(newLora) =>
              setValues((state) => {
                state.set(newLora, number);
                state.delete(lora);
                return state;
              })
            }
            setNumber={(newNumber) =>
              setValues((state) => {
                state.set(lora, newNumber);
                return state;
              })
            }
          />
        ))}
      </div>
    </BaseNode>
  );
};

const Item: FC<{
  lora: Lora;
  number: number;
  setLora: (lora: Lora) => void;
  setNumber: (number: number) => void;
}> = ({ lora, number, setLora, setNumber }) => (
  <>
    <input className={inputStyles} value={lora} readOnly />
    <input
      className={inputStyles}
      value={number}
      type="number"
      onChange={(e) => setNumber(parseInt(e.target.value))}
    />
  </>
);

export default LoraNumberMap;
