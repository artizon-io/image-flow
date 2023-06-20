import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { EndpointDataType, outputEndpointSchema } from "./BaseHandle";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";
import { useGraphStore } from "../Store";
import { z } from "zod";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

const createData = (value?: LoraMap): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Lora Number Map",
      type: EndpointDataType.LoraNumberMap,
      value: value ?? new Map(),
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([
    outputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.LoraNumberMap
    ),
  ]),
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
        {[...outputs[0].value].map(([lora, number], index) => (
          <Item
            key={index}
            lora={lora}
            number={number}
            setLora={(newLora) => {
              setNodeData(
                id,
                produce(data, (draft) => {
                  draft.outputs[0].value.set(newLora, number);
                  draft.outputs[0].value.delete(lora);
                })
              );
            }}
            setNumber={(newNumber) => {
              setNodeData(
                id,
                produce(data, (draft) => {
                  draft.outputs[0].value.set(lora, newNumber);
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
