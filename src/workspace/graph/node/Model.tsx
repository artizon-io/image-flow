import { FC, useEffect, useMemo, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, OutputEndpoint } from "./BaseHandle";
import { inputStyles, labelStyles, twoColumnGridStyles } from "./styles";
import { useGraphStore } from "../Store";

class Model {}

export type ModelNodeData = NodeData & {
  initialModelName?: string;
  initialModelVersion?: string;
  modelName?: string;
  modelVersion?: string;
};

const StableDiffusionModelNode: FC<NodeProps<ModelNodeData>> = ({
  id,
  data,
  ...props
}) => {
  const initialData = useMemo(
    () => ({
      modelName: "" as string,
      modelVersion: "" as string,
      outputs: [
        {
          id: "model",
          label: "Model",
          type: EndpointDataType.Model,
          value: new Model(),
        },
      ] as [OutputEndpoint],
    }),
    []
  );

  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeData<typeof initialData>(id, {
      ...initialData,
      modelName: data.initialModelName ?? "",
      modelVersion: data.initialModelVersion ?? "",
      outputs: [
        {
          ...initialData.outputs[0],
          // TODO: create model class
          value: new Model(),
        },
      ],
    });
  }, []);

  if (!outputs) return null;

  return (
    <BaseNode id={id} data={data} label="Stable Diffusion Model" {...props}>
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>Model Name:</label>
        <input className={inputStyles} value={data.modelName ?? ""} readOnly />
        <label className={labelStyles}>Version:</label>
        <input
          className={inputStyles}
          value={data.modelVersion ?? ""}
          readOnly
        />
      </div>
    </BaseNode>
  );
};

export default StableDiffusionModelNode;
