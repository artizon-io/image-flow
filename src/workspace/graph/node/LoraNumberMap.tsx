import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";
import { useGraphStore } from "../Store";
import { z } from "zod";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { loraNumberMapOutputEndpointSchema } from "./endpoint";

const createData = (map?: LoraWeightMap): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Lora Number Map",
      data: {
        type: "lora-number-map",
        colorHue: 200,
        map: map ?? new Map(),
      },
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([loraNumberMapOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createLoraNumberMapNodeData,
  dataSchema as loraNumberMapNodeDataSchema,
};

export type { NodeData as LoraNumberMapNodeData };

const LoraNumberMap: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} label="Lora Number Map" {...props}>
      <div className={twMerge(twoColumnGridStyles, "gap-x-1 gap-y-2")}>
        {/* TODO: find a better key */}
        {[...outputs[0].data.map!].map(([lora, number], index) => (
          <Item
            key={index}
            lora={lora}
            number={number}
            setLora={(newLora) => {
              setNodeData(
                id,
                produce(data, (draft) => {
                  draft.outputs[0].data.map!.set(newLora, number);
                  draft.outputs[0].data.map!.delete(lora);
                })
              );
            }}
            setNumber={(newNumber) => {
              setNodeData(
                id,
                produce(data, (draft) => {
                  draft.outputs[0].data.map!.set(lora, newNumber);
                })
              );
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
    <input className={inputStyles} value={lora.name} readOnly />
    <input
      className={inputStyles}
      value={number}
      type="number"
      onChange={(e) => setNumber(parseInt(e.target.value))}
    />
  </>
);

export default LoraNumberMap;
