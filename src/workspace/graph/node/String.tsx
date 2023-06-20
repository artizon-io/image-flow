import { ChangeEventHandler, FC } from "react";
import { NodeProps, useUpdateNodeInternals } from "reactflow";
import BaseNode from "./Base";
import { EndpointDataType, outputEndpointSchema } from "./BaseHandle";
import { textareaStyles } from "./styles";
import { useGraphStore } from "../Store";
import { z } from "zod";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

const createData = (value?: string): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "String",
      type: EndpointDataType.String,
      value: value ?? "",
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([
    outputEndpointSchema.refine((val) => val.type === EndpointDataType.String),
  ]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createStringNodeData,
  dataSchema as stringNodeDataSchema,
};

export type { NodeData as StringNodeData };

const StringNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setNodeData(
      id,
      produce(data, (draft) => {
        draft.outputs[0].value = e.target.value;
      })
    );
  };

  return (
    <BaseNode id={id} data={data} label="String" {...props}>
      <textarea
        className={textareaStyles}
        value={outputs[0].value}
        onChange={handleValueChange}
      />
    </BaseNode>
  );
};

export default StringNode;
