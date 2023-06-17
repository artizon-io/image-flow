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
      id: "image",
      label: "Image",
    },
  ],
};

export type NodeData = {};

const ImageOutputNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Image Output"
      {...props}
    ></BaseNode>
  );
};

export default ImageOutputNode;
