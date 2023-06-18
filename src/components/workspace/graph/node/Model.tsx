import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";
import { tailwind } from "../../../../utils/cntl/tailwind";

export const config: NodeConfig = {
  outputs: [
    {
      id: "model",
      label: "Model",
      type: NodeEndpointType.Model,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  modelName: string;
  modelVersion: string;
};

const StableDiffusionModelNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const { modelName, modelVersion } = data;

  const labelStyles = tailwind`text-neutral-500 font-medium text-s`;
  const valueStyles = tailwind`text-neutral-300 font-normal text-s`;

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Stable Diffusion Model"
      {...props}
    >
      <div className="grid grid-cols-2 gap-x-2">
        <h3 className={labelStyles}>Model Name:</h3>
        <h3 className={valueStyles}>{modelName}</h3>
        <p className={labelStyles}>Version:</p>
        <p className={valueStyles}>{modelVersion}</p>
      </div>
    </BaseNode>
  );
};

export default StableDiffusionModelNode;
