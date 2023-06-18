import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";

export const config: NodeConfig = {
  inputs: [
    {
      id: "input-image",
      label: "Image",
      type: NodeEndpointType.Image,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "prompt",
      label: "Prompt",
      type: NodeEndpointType.String,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "negative-prompt",
      label: "Negative Prompt",
      type: NodeEndpointType.String,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "prompt-map",
      label: "Prompt Weight Map",
      type: NodeEndpointType.StringNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "negative-prompt-map",
      label: "Negative Prompt Weight Map",
      type: NodeEndpointType.StringNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "lora-map",
      label: "Lora Weight Map",
      type: NodeEndpointType.LoraNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "negative-lora-map",
      label: "Negative Lora Weight Map",
      type: NodeEndpointType.LoraNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "model",
      label: "Model",
      type: NodeEndpointType.Model,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "sampler",
      label: "Sampler",
      type: NodeEndpointType.Sampler,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "steps",
      label: "Steps",
      type: NodeEndpointType.Number,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "resolution",
      label: "Resolution",
      type: NodeEndpointType.NumberPair,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "denoising-strength",
      label: "Denoising Strength",
      type: NodeEndpointType.Number,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "cfg-scale",
      label: "CFG Scale",
      type: NodeEndpointType.Number,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "clip-skip",
      label: "CLIP Skip",
      type: NodeEndpointType.Number,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "seed",
      label: "Seed",
      type: NodeEndpointType.Number,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
  outputs: [
    {
      id: "output-image",
      label: "Image",
      type: NodeEndpointType.Image,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
    {
      id: "clip",
      label: "CLIP",
      type: NodeEndpointType.String,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {};

const Automatic1111Node: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Automatic 1111"
      {...props}
    ></BaseNode>
  );
};

export default Automatic1111Node;
