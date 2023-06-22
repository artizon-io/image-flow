import { FC, useEffect } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "../Base";
import {} from "../BaseHandle";
import { useGraphStore } from "../../Store";
import { produce } from "immer";
import { z } from "zod";
import { MinusIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import {
  inputEndpointSchema,
  outputEndpointSchema,
  stringInputEndpointSchema,
  stringOutputEndpointSchema,
} from "../endpoint";

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
  inputs: z.tuple([stringInputEndpointSchema, stringInputEndpointSchema]),
  outputs: z.tuple([stringOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createSubtractStringNodeData,
  dataSchema as subtractStringNodeDataSchema,
};

export type { NodeData as SubtractStringNodeData };

const SubtractStringNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <MinusIcon />
    </BaseNode>
  );
};

export default SubtractStringNode;
