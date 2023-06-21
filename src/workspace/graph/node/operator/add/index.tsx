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
        string: "",
        colorHue: 40,
      },
    },
  ],
});

const dataSchema = z.object({
  inputs: z.array(stringInputEndpointSchema).min(1),
  outputs: z.tuple([stringOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export { createData as createAddNodeData, dataSchema as addNodeDataSchema };

export type { NodeData as AddNodeData };

const AddNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddNode;
