import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { BaseNodeData } from "./Base";
import {} from "./BaseHandle";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  imageInputEndpointSchema,
  loraNumberMapInputEndpointSchema,
  modelInputEndpointSchema,
  numberInputEndpointSchema,
  numberPairInputEndpointSchema,
  samplerInputEndpointSchema,
  stringInputEndpointSchema,
  stringNumberMapInputEndpointSchema,
  stringOutputEndpointSchema,
  imageOutputEndpointSchema,
} from "./endpoint";

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
    {
      id: uuidv4(),
      label: "Prompt",
      type: {
        type: "string",
        colorHue: 40,
      },
    },
    {
      id: uuidv4(),
      label: "Negative Prompt",
      type: {
        type: "string",
        colorHue: 40,
      },
    },
    {
      id: uuidv4(),
      label: "Prompt Weight Map",
      type: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
    {
      id: uuidv4(),
      label: "Negative Prompt Weight Map",
      type: {
        type: "string-number-map",
        colorHue: 160,
      },
    },
    {
      id: uuidv4(),
      label: "Lora Weight Map",
      type: {
        type: "lora-number-map",
        colorHue: 200,
      },
    },
    {
      id: uuidv4(),
      label: "Negative Lora Weight Map",
      type: {
        type: "lora-number-map",
        colorHue: 200,
      },
    },
    {
      id: uuidv4(),
      label: "Model",
      type: {
        type: "model",
        colorHue: 260,
      },
    },
    {
      id: uuidv4(),
      label: "Sampler",
      type: {
        type: "sampler",
        colorHue: 260,
      },
    },
    {
      id: uuidv4(),
      label: "Steps",
      type: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Resolution",
      type: {
        type: "number-pair",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Denoising Strength",
      type: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "CFG Scale",
      type: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "CLIP Skip",
      type: {
        type: "number",
        colorHue: 0,
      },
    },
    {
      id: uuidv4(),
      label: "Seed",
      type: {
        type: "number",
        colorHue: 0,
      },
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Image",
      data: {
        type: "image",
        colorHue: 300,
      },
    },
    {
      id: uuidv4(),
      label: "CLIP",
      data: {
        type: "string",
        colorHue: 40,
      },
    },
  ],
});

const dataSchema = z.object({
  inputs: z.tuple([
    imageInputEndpointSchema,
    stringInputEndpointSchema,
    stringInputEndpointSchema,
    stringNumberMapInputEndpointSchema,
    stringNumberMapInputEndpointSchema,
    loraNumberMapInputEndpointSchema,
    loraNumberMapInputEndpointSchema,
    modelInputEndpointSchema,
    samplerInputEndpointSchema,
    numberInputEndpointSchema,
    numberPairInputEndpointSchema,
    numberInputEndpointSchema,
    numberInputEndpointSchema,
    numberInputEndpointSchema,
    numberInputEndpointSchema,
  ]),
  outputs: z.tuple([imageOutputEndpointSchema, stringOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createAutomatic1111NodeData,
  dataSchema as automatic1111NodeDataSchema,
};

export type { NodeData as Automatic1111NodeData };

const Automatic1111Node: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  return (
    <BaseNode id={id} data={data} label="Automatic 1111" {...props}></BaseNode>
  );
};

export default Automatic1111Node;
