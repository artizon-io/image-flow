import { FC, useEffect } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "../Base";
import {} from "../BaseHandle";
import { useGraphStore } from "../../Store";
import { produce } from "immer";
import { z } from "zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import {
  inputEndpointSchema,
  outputEndpointSchema,
  stringInputEndpointSchema,
  stringOutputEndpointSchema,
} from "../endpoint";

const createData = (): NodeData => ({
  dynamicInputSize: true,
  inputs: [
    {
      id: uuidv4(),
      label: "Input",
      type: {
        type: "string",
        colorHue: 40,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Output",
      data: {
        type: "string",
        colorHue: 40,
      },
    },
  ],
});

const dataSchema = z.object({
  dynamicInputSize: z.literal(true),
  inputs: z.array(stringInputEndpointSchema).length(1),
  outputs: z.tuple([stringOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createAddStringNodeData,
  dataSchema as addStringNodeDataSchema,
};

export type { NodeData as AddStringNodeData };

const AddStringNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddStringNode;
