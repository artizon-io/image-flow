import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import {} from "./BaseHandle";
import { textareaStyles } from "./styles";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  stringInputEndpointSchema,
  stringOutputEndpointSchema,
} from "./endpointSchemas";

const createData = (): NodeData => ({
  stringOutput: {
    id: uuidv4(),
    label: "String",
    data: {
      type: "string",
      colorHue: 40,
    },
  },
  inputs: [
    {
      id: uuidv4(),
      label: "String",
      type: {
        type: "string",
        colorHue: 40,
      },
    },
  ],
});

const dataSchema = z.object({
  stringOutput: stringOutputEndpointSchema,
  inputs: z.tuple([stringInputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createStringOutputNodeData,
  dataSchema as stringOutputNodeDataSchema,
};

export type { NodeData as StringOutputNodeData };

const StringOutputNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, stringOutput } = data;

  return (
    <BaseNode id={id} data={data} label="String Output" {...props}>
      <textarea
        value={stringOutput.data.string ?? "No Output"}
        className={textareaStyles}
        readOnly
      />
    </BaseNode>
  );
};

export default StringOutputNode;
