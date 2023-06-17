import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode from "./Base";

const config = {
  inputs: [
    {
      id: "prompt",
      label: "Prompt",
    },
    {
      id: "negative-prompt",
      label: "Negative Prompt",
    },
    {
      id: "model",
      label: "Model",
    },
    {
      id: "sampler",
      label: "Sampler",
    },
    {
      id: "steps",
      label: "Steps",
    },
    {
      id: "input-image",
      label: "Image",
    },
  ],
  outputs: [
    {
      id: "output-image",
      label: "Image",
    },
    {
      id: "clip",
      label: "CLIP",
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
