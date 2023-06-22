import { ChangeEventHandler, FC, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { inputStyles } from "./styles";
import { useGraphStore } from "../Store";
import { produce } from "immer";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { numberOutputEndpointSchema } from "./endpoint";

const createData = (value?: number): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Number",
      data: {
        type: "number",
        colorHue: 0,
        number: value ?? 0,
      },
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([numberOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createNumberNodeData,
  dataSchema as numberNodeDataSchema,
};

export type { NodeData as NumberNodeData };

const NumberNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { outputs } = data;

  const value = outputs[0].data.number!;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;

    setNodeData<NodeData>(
      id,
      produce(data, (draft) => {
        draft.outputs[0].data.number = value;
      })
    );
  };

  return (
    <BaseNode id={id} data={data} label="Number" {...props}>
      <input
        className={inputStyles}
        defaultValue={value}
        type="number"
        onChange={handleValueChange}
      />
    </BaseNode>
  );
};

export default NumberNode;
