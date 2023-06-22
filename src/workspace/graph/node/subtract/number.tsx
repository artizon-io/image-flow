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
  numberInputEndpointSchema,
  numberOutputEndpointSchema,
  outputEndpointSchema,
  stringInputEndpointSchema,
  stringOutputEndpointSchema,
} from "../endpointSchemas";

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
  inputs: z.tuple([numberInputEndpointSchema, numberInputEndpointSchema]),
  outputs: z.tuple([numberOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createSubtractNumberNodeData,
  dataSchema as subtractNumberNodeDataSchema,
};

export type { NodeData as SubtractNumberNodeData };

const SubtractNumberNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <MinusIcon />
    </BaseNode>
  );
};

export default SubtractNumberNode;
