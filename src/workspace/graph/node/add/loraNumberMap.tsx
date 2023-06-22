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
  loraNumberMapInputEndpointSchema,
  loraNumberMapOutputEndpointSchema,
  numberInputEndpointSchema,
  numberOutputEndpointSchema,
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
  dynamicInputSize: z.literal(true),
  inputs: z.array(loraNumberMapInputEndpointSchema).length(1),
  outputs: z.tuple([loraNumberMapOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createAddLoraNumberMapNodeData,
  dataSchema as addLoraNumberMapNodeDataSchema,
};

export type { NodeData as AddLoraNumberMapNodeData };

const AddLoraNumberMapNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddLoraNumberMapNode;
