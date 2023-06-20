import { FC, useEffect } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "../Base";
import {
  EndpointDataType,
  inputEndpointSchema,
  outputEndpointSchema,
} from "../BaseHandle";
import { useGraphStore } from "../../Store";
import { produce } from "immer";
import { z } from "zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";

const createData = (): NodeData => ({
  inputs: [],
  outputs: [
    {
      id: uuidv4(),
      label: "Output",
      type: new Set([
        EndpointDataType.Number,
        EndpointDataType.String,
        EndpointDataType.LoraNumberMap,
        EndpointDataType.NumberPair,
        EndpointDataType.StringNumberMap,
      ]),
      value: null,
    },
  ],
});

const dataSchema = z.object({
  inputs: z.array(inputEndpointSchema),
  outputs: z.tuple([outputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export { createData as createAddNodeData, dataSchema as addNodeDataSchema };

export type { NodeData as AddNodeData };

const AddNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);
  const edges = useGraphStore((state) => state.edges);
  const getConnectedOutputEndpoint = useGraphStore(
    (state) => state.getConnectedOutputEndpoint
  );

  useEffect(() => {
    const allInputsOccupied = inputs.every(
      (i) => !!getConnectedOutputEndpoint(i.id)
    );
    console.debug("Add Node: allInputsOccupied", allInputsOccupied);
    if (allInputsOccupied) {
      setNodeData(
        id,
        produce(data, (draft) => {
          data.inputs.push({
            id: uuidv4(),
            label: "Input",
            type:
              inputs[0]?.type ??
              new Set([
                EndpointDataType.Number,
                EndpointDataType.String,
                EndpointDataType.LoraNumberMap,
                EndpointDataType.NumberPair,
                EndpointDataType.StringNumberMap,
              ]),
          });
        })
      );
    }
  }, [edges]);

  return (
    <BaseNode id={id} data={data} {...props}>
      <PlusIcon />
    </BaseNode>
  );
};

export default AddNode;
