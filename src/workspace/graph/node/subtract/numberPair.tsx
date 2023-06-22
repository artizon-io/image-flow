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
  numberPairInputEndpointSchema,
  numberPairOutputEndpointSchema,
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
        type: "number-pair",
        colorHue: 0,
      },
    },
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
  inputs: z.tuple([
    numberPairInputEndpointSchema,
    numberPairInputEndpointSchema,
  ]),
  outputs: z.tuple([numberPairOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createSubtractNumberPairNodeData,
  dataSchema as subtractNumberPairNodeDataSchema,
};

export type { NodeData as SubtractNumberPairNodeData };

const SubtractNumberPairNode: FC<NodeProps<NodeData>> = ({
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

export default SubtractNumberPairNode;
