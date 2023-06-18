import { FC, memo, useState } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode, { NodeConfig, NodeEndpointType } from "./Base";
import {
  inputStyles,
  labelStyles,
  twoColumnGridStyles,
  valueStyles,
} from "./styles";

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
  modelName?: string;
  modelVersion?: string;
};

const StableDiffusionModelNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const [modelName, setModelName] = useState<string>(data.modelName ?? "");
  const [modelVersion, setModelVersion] = useState<string>(
    data.modelVersion ?? ""
  );

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Stable Diffusion Model"
      {...props}
    >
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>Model Name:</label>
        <input className={inputStyles} value={modelName} readOnly />
        <label className={labelStyles}>Version:</label>
        <input className={inputStyles} value={modelVersion} readOnly />
      </div>
    </BaseNode>
  );
};

export default StableDiffusionModelNode;
