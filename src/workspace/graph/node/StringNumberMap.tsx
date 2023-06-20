import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { EndpointDataType, outputEndpointSchema } from "./BaseHandle";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";
import { useGraphStore } from "../Store";
import { produce } from "immer";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const createData = (value?: Map<string, number>): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "String Number Map",
      type: EndpointDataType.StringNumberMap,
      value: value ?? new Map<string, number>(),
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([
    outputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.StringNumberMap
    ),
  ]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createStringNumberMapNodeData,
  dataSchema as stringNumberMapNodeDataSchema,
};

export type { NodeData as StringNumberMapNodeData };

const StringNumberMapNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} label="String Number Map" {...props}>
      <div className={twMerge(twoColumnGridStyles, "gap-x-1 gap-y-2")}>
        {/* TODO: find a better key */}
        {[...outputs[0].value].map(([string, number], index) => (
          <Item
            key={index}
            string={string}
            number={number}
            setString={(newString) => {
              setNodeData(
                id,
                produce(data, (draft) => {
                  draft.outputs[0].value.set(newString, number);
                  draft.outputs[0].value.delete(string);
                })
              );
            }}
            setNumber={(newNumber) => {
              setNodeData(
                id,
                produce(data, (draft) => {
                  draft.outputs[0].value.set(string, newNumber);
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
  string: string;
  number: number;
  setString: (string: string) => void;
  setNumber: (number: number) => void;
}> = ({ string, number, setString, setNumber }) => (
  <>
    <input
      className={inputStyles}
      value={string}
      onChange={(e) => setString(e.target.value)}
    />
    <input
      className={inputStyles}
      value={number}
      type="number"
      onChange={(e) => setNumber(parseInt(e.target.value))}
    />
  </>
);

export default StringNumberMapNode;
