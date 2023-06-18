import { FC, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import BaseNode from "./Base";
import { tailwind } from "../../../../utils/cntl/tailwind";

const config = {
  outputs: [
    {
      id: "lora-number-map",
      label: "Lora Number Map",
    },
  ],
};

export type NodeData = {
  value: LoraMap;
};

const LoraNumberMap: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { value: values } = data;

  const labelStyles = tailwind`text-neutral-500 font-medium text-s`;
  const valueStyles = tailwind`text-neutral-300 font-normal text-s`;

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="Lora Number Map"
      {...props}
    >
      <div className="grid grid-cols-1 gap-2">
        {[...values].map(([key, value]) => (
          <div className="" key={key}>
            <p className={labelStyles}>{key}</p>
            <p className={valueStyles}>{value}</p>
          </div>
        ))}
      </div>
    </BaseNode>
  );
};

export default LoraNumberMap;
