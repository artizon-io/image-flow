import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { EndpointDataType, outputEndpointSchema } from "./BaseHandle";
import { inputStyles, labelStyles, twoColumnGridStyles } from "./styles";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const createData = (model?: {
  modelName: string;
  modelVersion: string;
}): NodeData => ({
  modelName: model?.modelName ?? "",
  modelVersion: model?.modelVersion ?? "",
  outputs: [
    {
      id: uuidv4(),
      label: "Model",
      type: EndpointDataType.Model,
      value: model ?? {},
    },
  ],
});

const dataSchema = z.object({
  modelName: z.string(),
  modelVersion: z.string(),
  outputs: z.tuple([
    outputEndpointSchema.refine((val) => val.type === EndpointDataType.Model),
  ]),
});

type NodeData = z.infer<typeof dataSchema>;

export { createData as createModelNodeData, dataSchema as modelNodeDataSchema };

export type { NodeData as ModelNodeData };

const ModelNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  return (
    <BaseNode id={id} data={data} label="Stable Diffusion Model" {...props}>
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>Model Name:</label>
        <input className={inputStyles} value={data.modelName ?? ""} readOnly />
        <label className={labelStyles}>Version:</label>
        <input
          className={inputStyles}
          value={data.modelVersion ?? ""}
          readOnly
        />
      </div>
    </BaseNode>
  );
};

export default ModelNode;
