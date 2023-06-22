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
  numberInputEndpointSchema,
  numberOutputEndpointSchema,
  numberPairInputEndpointSchema,
  numberPairOutputEndpointSchema,
  outputEndpointSchema,
  stringInputEndpointSchema,
  stringOutputEndpointSchema,
} from "../endpointSchemas";

const createData = (): NodeData => ({
  dynamicInputSize: true,
  inputs: [
    {
      id: uuidv4(),
      label: "Input",
      type: {
        type: "number-pair",
        colorHue: 0,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Output",
      data: {
        type: "number-pair",
        colorHue: 0,
      },
    },
  ],
});

const dataSchema = z.object({
  dynamicInputSize: z.literal(true),
  inputs: z.array(numberPairInputEndpointSchema).length(1),
  outputs: z.tuple([numberPairOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createAddNumberPairNodeData,
  dataSchema as addNumberPairNodeDataSchema,
};

export type { NodeData as AddNumberPairNodeData };

const AddNumberPairNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddNumberPairNode;
