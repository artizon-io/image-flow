import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import {} from "./BaseHandle";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  imageData,
  imageInputEndpointSchema,
  imageOutputEndpointSchema,
  loraNumberMapOutputEndpointSchema,
  modelOutputEndpointSchema,
  numberOutputEndpointSchema,
  numberPairOutputEndpointSchema,
  samplerOutputEndpointSchema,
  stringNumberMapOutputEndpointSchema,
  stringOutputEndpointSchema,
} from "./endpointSchemas";
import { inputStyles, labelStyles, twoColumnGridStyles } from "./styles";

const createData = (): NodeData => ({
  inputs: [
    {
      id: uuidv4(),
      label: "Image",
      type: {
        type: "image",
        colorHue: 300,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Prompt",
      data: {
        type: "string",
        colorHue: 40,
      },
    },
    {
      id: uuidv4(),
      label: "Negative Prompt",
      data: {
        type: "string",
        colorHue: 40,
      },
    },
    {
      id: uuidv4(),
      label: "Prompt Weight Map",
      data: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
    {
      id: uuidv4(),
      label: "Negative Prompt Weight Map",
      data: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
    {
      id: uuidv4(),
      label: "LoRA Weight Map",
      data: {
        type: "lora-number-map",
        colorHue: 200,
      },
    },
    {
      id: uuidv4(),
      label: "Negative LoRA Weight Map",
      data: {
        type: "lora-number-map",
        colorHue: 200,
      },
    },
    {
      id: uuidv4(),
      label: "Model",
      data: {
        type: "model",
        colorHue: 260,
      },
    },
    {
      id: uuidv4(),
      label: "Sampler",
      data: {
        type: "sampler",
        colorHue: 260,
      },
    },
    {
      id: uuidv4(),
      label: "Steps",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Resolution",
      data: {
        type: "number-pair",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Denoising Strength",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "CFG Scale",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "CLIP Skip",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Seed",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Highres Fix Sampler",
      data: {
        type: "sampler",
        colorHue: 260,
      },
    },
    {
      id: uuidv4(),
      label: "Highres Fix Steps",
      data: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Highres Fix Resolution",
      data: {
        type: "number-pair",
        colorHue: 0,
      },
    },
  ],
});

const dataSchema = z.object({
  inputs: z.tuple([imageInputEndpointSchema]),
  outputs: z.tuple([
    stringOutputEndpointSchema,
    stringOutputEndpointSchema,
    stringNumberMapOutputEndpointSchema,
    stringNumberMapOutputEndpointSchema,
    loraNumberMapOutputEndpointSchema,
    loraNumberMapOutputEndpointSchema,
    modelOutputEndpointSchema,
    samplerOutputEndpointSchema,
    numberOutputEndpointSchema,
    numberPairOutputEndpointSchema,
    numberOutputEndpointSchema,
    numberOutputEndpointSchema,
    numberOutputEndpointSchema,
    numberOutputEndpointSchema,
    samplerOutputEndpointSchema,
    numberOutputEndpointSchema,
    numberPairOutputEndpointSchema,
  ]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createImageMetadataNodeData,
  dataSchema as imageMetadataNodeDataSchema,
};

export type { NodeData as ImageMetadataNodeData };

const ImageMetadataNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, outputs } = data;

  return (
    <BaseNode id={id} data={data} label="Image Metadata" {...props}>
      <div className={twoColumnGridStyles}></div>
    </BaseNode>
  );
};

export default ImageMetadataNode;
