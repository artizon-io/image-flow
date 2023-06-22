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
        colorHue: 40,
      },
    },
  ],
});

const dataSchema = z.object({
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

  useEffect(() => {
    const numUnconnectedInput = data.inputs.filter(
      (input) => !input.edge
    ).length;

    if (numUnconnectedInput === 0) {
      setNodeData(
        id,
        produce(data, (draft) => {
          draft.inputs.push({
            id: uuidv4(),
            label: "Input",
            type: {
              type: "string",
              colorHue: 40,
            },
          });
        })
      );
    } else if (numUnconnectedInput > 1) {
      setNodeData(
        id,
        produce(data, (draft) => {
          const randomUnconnectedInput = draft.inputs.filter(
            (input) => !input.edge
          )[0];
          draft.inputs = draft.inputs.filter((input) => input.edge);
          draft.inputs.push(randomUnconnectedInput);
        })
      );
    }
  }, [data.inputs]);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddStringNode;
