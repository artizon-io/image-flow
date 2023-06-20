import { FC, useEffect, useMemo, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { InputEndpoint, EndpointDataType } from "./BaseHandle";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";
import { useGraphStore } from "../Store";

export type LoraNumberMapNodeData = NodeData & {
  initialValue?: LoraMap;
};

const LoraNumberMap: FC<NodeProps<LoraNumberMapNodeData>> = ({
  id,
  data,
  ...props
}) => {
  const initialData = useMemo(
    () => ({
      outputs: [
        {
          id: "lora-number-map",
          label: "Lora Number Map",
          type: EndpointDataType.LoraNumberMap,
          isConnectableTo(input: InputEndpoint) {
            return input.type === this.type;
          },
          value: new Map() as LoraMap,
        },
      ],
    }),
    []
  );

  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeData<typeof initialData>(id, {
      ...initialData,
      outputs: [
        {
          ...initialData.outputs[0],
          value: data.initialValue ?? new Map(),
        },
      ],
    });
  }, []);

  if (!outputs) return null;

  return (
    <BaseNode id={id} data={data} label="Lora Number Map" {...props}>
      <div className={twMerge(twoColumnGridStyles, "gap-x-1 gap-y-2")}>
        {/* TODO: find a better key */}
        {[...outputs![0].value].map(([lora, number], index) => (
          <Item
            key={index}
            lora={lora}
            number={number}
            setLora={(newLora) => {
              outputs![0].value.set(newLora, number);
              outputs![0].value.delete(lora);
              setNodeData(id, {
                ...data,
              });
            }}
            setNumber={(newNumber) => {
              outputs![0].value.set(lora, newNumber);
              setNodeData(id, {
                ...data,
              });
            }}
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
