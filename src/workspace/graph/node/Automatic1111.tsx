import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { BaseNodeData } from "./Base";
import {
  EndpointDataType,
  OutputEndpoint,
  inputEndpointSchema,
  outputEndpointSchema,
} from "./BaseHandle";
import { z } from "zod";

const createData = (): NodeData => ({
  inputs: [
    {
      id: "input-image",
      label: "Image",
      type: EndpointDataType.Image,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "prompt",
      label: "Prompt",
      type: EndpointDataType.String,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "negative-prompt",
      label: "Negative Prompt",
      type: EndpointDataType.String,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "prompt-map",
      label: "Prompt Weight Map",
      type: EndpointDataType.StringNumberMap,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "negative-prompt-map",
      label: "Negative Prompt Weight Map",
      type: EndpointDataType.StringNumberMap,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "lora-map",
      label: "Lora Weight Map",
      type: EndpointDataType.LoraNumberMap,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "negative-lora-map",
      label: "Negative Lora Weight Map",
      type: EndpointDataType.LoraNumberMap,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "model",
      label: "Model",
      type: EndpointDataType.Model,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "sampler",
      label: "Sampler",
      type: EndpointDataType.Sampler,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "steps",
      label: "Steps",
      type: EndpointDataType.Number,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "resolution",
      label: "Resolution",
      type: EndpointDataType.NumberPair,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "denoising-strength",
      label: "Denoising Strength",
      type: EndpointDataType.Number,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "cfg-scale",
      label: "CFG Scale",
      type: EndpointDataType.Number,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "clip-skip",
      label: "CLIP Skip",
      type: EndpointDataType.Number,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
    {
      id: "seed",
      label: "Seed",
      type: EndpointDataType.Number,
      isConnectableTo(output: OutputEndpoint) {
        return output.type === this.type;
      },
    },
  ],
  outputs: [
    {
      id: "output-image",
      label: "Image",
      type: EndpointDataType.Image,
      value: "",
    },
    {
      id: "clip",
      label: "CLIP",
      type: EndpointDataType.String,
      value: "",
    },
  ],
});

const dataSchema = z.object({
  inputs: z.tuple([
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Image),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.String),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.String),
    inputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.StringNumberMap
    ),
    inputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.StringNumberMap
    ),
    inputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.LoraNumberMap
    ),
    inputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.LoraNumberMap
    ),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Model),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Sampler),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Number),
    inputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.NumberPair
    ),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Number),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Number),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Number),
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Number),
  ]),
  outputs: z.tuple([
    outputEndpointSchema.refine((val) => val.type === EndpointDataType.Image),
    outputEndpointSchema.refine((val) => val.type === EndpointDataType.String),
  ]),
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
