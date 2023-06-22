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
  loraNumberMapInputEndpointSchema,
  loraNumberMapOutputEndpointSchema,
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
        type: "lora-number-map",
        colorHue: 200,
      },
    },
    {
      id: uuidv4(),
      label: "Input",
      type: {
        type: "lora-number-map",
        colorHue: 200,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Output",
      data: {
        type: "lora-number-map",
        colorHue: 200,
      },
    },
  ],
});

const dataSchema = z.object({
  inputs: z.tuple([
    loraNumberMapInputEndpointSchema,
    loraNumberMapInputEndpointSchema,
  ]),
  outputs: z.tuple([loraNumberMapOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createSubtractLoraNumberMapNodeData,
  dataSchema as subtractLoraNumberMapNodeDataSchema,
};

export type { NodeData as SubtractLoraNumberMapNodeData };

const SubtractLoraNumberMapNode: FC<NodeProps<NodeData>> = ({
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

export default SubtractLoraNumberMapNode;
