import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { inputStyles, labelStyles, twoColumnGridStyles } from "./styles";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  modelOutputEndpointSchema,
  samplerOutputEndpointSchema,
} from "./endpointSchemas";

const createData = (sampler?: {
  name: string;
  version?: string;
  hash?: string;
}): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Sampler",
      data: {
        type: "sampler",
        colorHue: 260,
        data: sampler,
      },
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([samplerOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createSamplerNodeData,
  dataSchema as samplerNodeDataSchema,
};

export type { NodeData as SamplerNodeData };

const SamplerNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  return (
    <BaseNode id={id} data={data} label="Sampler" {...props}>
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>Sampler Name:</label>
        <input
          className={inputStyles}
          value={data.outputs[0].data.data?.name ?? ""}
          readOnly
        />
      </div>
    </BaseNode>
  );
};

export default SamplerNode;
