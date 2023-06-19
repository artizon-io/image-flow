import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeConfig } from "./Base";
import { NodeEndpointType } from "./BaseHandle";

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

export type NodeData = {
  value?: string;
};

const ImageOutputNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { value } = data;

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Image Output"
      {...props}
    >
      {!!value ? (
        <img src={value} />
      ) : (
        <div className="flex justify-center items-center w-[220px] h-[220px] bg-neutral-800 opacity-90">
          <p className="text-neutral-500 text-xs font-mono">No Image</p>
        </div>
      )}
    </BaseNode>
  );
};

export default ImageOutputNode;
