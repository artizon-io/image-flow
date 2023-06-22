import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { inputStyles, labelStyles, twoColumnGridStyles } from "./styles";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { modelOutputEndpointSchema } from "./endpoint";

const createData = (model?: { name: string; version: string }): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Model",
      data: {
        type: "model",
        colorHue: 260,
        data: model,
      },
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([modelOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export { createData as createModelNodeData, dataSchema as modelNodeDataSchema };

export type { NodeData as ModelNodeData };

const ModelNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  return (
    <BaseNode id={id} data={data} label="Model" {...props}>
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>Model Name:</label>
        <input
          className={inputStyles}
          value={data.outputs[0].data.data?.name ?? ""}
          readOnly
        />
        <label className={labelStyles}>Version:</label>
        <input
          className={inputStyles}
          value={data.outputs[0].data.data?.version ?? ""}
          readOnly
        />
      </div>
    </BaseNode>
  );
};

export default ModelNode;
