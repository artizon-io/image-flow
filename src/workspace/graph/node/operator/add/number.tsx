import { FC, useEffect } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "../../Base";
import {} from "../../BaseHandle";
import { useGraphStore } from "../../../Store";
import { produce } from "immer";
import { z } from "zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import {
  inputEndpointSchema,
  numberInputEndpointSchema,
  numberOutputEndpointSchema,
  outputEndpointSchema,
  stringInputEndpointSchema,
  stringOutputEndpointSchema,
} from "../../endpoint";

const createData = (): NodeData => ({
  inputs: [
    {
      id: uuidv4(),
      label: "Input",
      type: {
        type: "number",
        colorHue: 0,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Output",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
  ],
});

const dataSchema = z.object({
  inputs: z.array(numberInputEndpointSchema).length(1),
  outputs: z.tuple([numberOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createAddNumberNodeData,
  dataSchema as addNumberNodeDataSchema,
};

export type { NodeData as AddNumberNodeData };

const AddNumberNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddNumberNode;
