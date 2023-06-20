import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import {
  EndpointDataType,
  OutputEndpoint,
  inputEndpointSchema,
} from "./BaseHandle";
import { textareaStyles } from "./styles";
import { z } from "zod";

const createData = (): NodeData => ({
  stringOutput: "",
  inputs: [
    {
      id: "string",
      label: "String",
      type: EndpointDataType.String,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
  ],
});

const dataSchema = z.object({
  stringOutput: z.string(),
  inputs: z.tuple([
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Image),
  ]),
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
        value={stringOutput ?? "No Output"}
        className={textareaStyles}
        readOnly
      />
    </BaseNode>
  );
};

export default StringOutputNode;
