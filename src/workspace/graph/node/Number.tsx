import { ChangeEventHandler, FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { EndpointDataType, outputEndpointSchema } from "./BaseHandle";
import { inputStyles } from "./styles";
import { useGraphStore } from "../Store";
import { produce } from "immer";
import { z } from "zod";

const createData = (value?: number): NodeData => ({
  outputs: [
    {
      id: "output-number",
      label: "Number",
      type: EndpointDataType.Number,
      value: value ?? 0,
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([
    outputEndpointSchema.refine((val) => val.type === EndpointDataType.Number),
  ]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createNumberNodeData,
  dataSchema as numberNodeDataSchema,
};

export type { NodeData as NumberNodeData };

const NumberNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNodeData<NodeData>(
      id,
      produce(data, (draft) => {
        draft.outputs[0].value = parseInt(e.target.value);
      })
    );
  };

  return (
    <BaseNode id={id} data={data} label="Number" {...props}>
      <input
        className={inputStyles}
        type="number"
        onChange={handleValueChange}
        value={outputs![0].value}
      />
    </BaseNode>
  );
};

export default NumberNode;
