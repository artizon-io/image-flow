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
      id: "image",
      label: "Image",
      type: NodeEndpointType.Image,
      isConnectableTo(other) {
        return other.type === this.type;
      },
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
