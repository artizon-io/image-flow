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
  stringNumberMapInputEndpointSchema,
  stringNumberMapOutputEndpointSchema,
  stringOutputEndpointSchema,
} from "../endpointSchemas";

const createData = (): NodeData => ({
  inputs: [
    {
      id: uuidv4(),
      label: "Input",
      type: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
    {
      id: uuidv4(),
      label: "Input",
      type: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Output",
      data: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
  ],
});

const dataSchema = z.object({
  inputs: z.tuple([
    stringNumberMapInputEndpointSchema,
    stringNumberMapInputEndpointSchema,
  ]),
  outputs: z.tuple([stringNumberMapOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createSubtractStringNumberMapNodeData,
  dataSchema as subtractStringNumberMapNodeDataSchema,
};

export type { NodeData as SubtractStringNumberMapNodeData };

const SubtractStringNumberMapNode: FC<NodeProps<NodeData>> = ({
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

export default SubtractStringNumberMapNode;
