import { FC, useEffect, useMemo } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, InputEndpoint, OutputEndpoint } from "./BaseHandle";
import { useGraphStore } from "../Store";

export type Automatic1111NodeData = NodeData & {};

const Automatic1111Node: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const initialData = useMemo(
    () =>
      ({
        inputs: [
          {
            id: "input-image",
            label: "Image",
            type: EndpointDataType.Image,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "prompt",
            label: "Prompt",
            type: EndpointDataType.String,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "negative-prompt",
            label: "Negative Prompt",
            type: EndpointDataType.String,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "prompt-map",
            label: "Prompt Weight Map",
            type: EndpointDataType.StringNumberMap,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "negative-prompt-map",
            label: "Negative Prompt Weight Map",
            type: EndpointDataType.StringNumberMap,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "lora-map",
            label: "Lora Weight Map",
            type: EndpointDataType.LoraNumberMap,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "negative-lora-map",
            label: "Negative Lora Weight Map",
            type: EndpointDataType.LoraNumberMap,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "model",
            label: "Model",
            type: EndpointDataType.Model,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "sampler",
            label: "Sampler",
            type: EndpointDataType.Sampler,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "steps",
            label: "Steps",
            type: EndpointDataType.Number,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "resolution",
            label: "Resolution",
            type: EndpointDataType.NumberPair,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "denoising-strength",
            label: "Denoising Strength",
            type: EndpointDataType.Number,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "cfg-scale",
            label: "CFG Scale",
            type: EndpointDataType.Number,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "clip-skip",
            label: "CLIP Skip",
            type: EndpointDataType.Number,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
          {
            id: "seed",
            label: "Seed",
            type: EndpointDataType.Number,
            isConnectableTo(input: InputEndpoint) {
              return input.type === this.type;
            },
          },
        ] as InputEndpoint[],
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
        ] as [OutputEndpoint, OutputEndpoint],
      }),
    []
  );

  const { inputs, outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeData<typeof initialData>(id, initialData);
  }, []);

  return (
    <BaseNode id={id} data={data} label="Automatic 1111" {...props}></BaseNode>
  );
};

export default Automatic1111Node;
