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
import { v4 as uuidv4 } from "uuid";

const createData = (): NodeData => ({
  inputs: [
    {
      id: uuidv4(),
      label: "Image",
      type: EndpointDataType.Image,
    },
    {
      id: uuidv4(),
      label: "Prompt",
      type: EndpointDataType.String,
    },
    {
      id: uuidv4(),
      label: "Negative Prompt",
      type: EndpointDataType.String,
    },
    {
      id: uuidv4(),
      label: "Prompt Weight Map",
      type: EndpointDataType.StringNumberMap,
    },
    {
      id: uuidv4(),
      label: "Negative Prompt Weight Map",
      type: EndpointDataType.StringNumberMap,
    },
    {
      id: uuidv4(),
      label: "Lora Weight Map",
      type: EndpointDataType.LoraNumberMap,
    },
    {
      id: uuidv4(),
      label: "Negative Lora Weight Map",
      type: EndpointDataType.LoraNumberMap,
    },
    {
      id: uuidv4(),
      label: "Model",
      type: EndpointDataType.Model,
    },
    {
      id: uuidv4(),
      label: "Sampler",
      type: EndpointDataType.Sampler,
    },
    {
      id: uuidv4(),
      label: "Steps",
      type: EndpointDataType.Number,
    },
    {
      id: uuidv4(),
      label: "Resolution",
      type: EndpointDataType.NumberPair,
    },
    {
      id: uuidv4(),
      label: "Denoising Strength",
      type: EndpointDataType.Number,
    },
    {
      id: uuidv4(),
      label: "CFG Scale",
      type: EndpointDataType.Number,
    },
    {
      id: uuidv4(),
      label: "CLIP Skip",
      type: EndpointDataType.Number,
    },
    {
      id: uuidv4(),
      label: "Seed",
      type: EndpointDataType.Number,
    },
  ],
  outputs: [
    {
      id: uuidv4(),
      label: "Image",
      type: EndpointDataType.Image,
      value: "",
    },
    {
      id: uuidv4(),
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
