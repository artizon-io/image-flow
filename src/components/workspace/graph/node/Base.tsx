import { FC, PropsWithChildren, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import { twJoin, twMerge } from "tailwind-merge";
import { tailwind } from "../../../../utils/cntl/tailwind";

type NodeEndpoint = {
  id: string;
  label: string;
  type: NodeEndpointType;
  isConnectableTo: (other: NodeEndpoint) => boolean;
};

export enum NodeEndpointType {
  Number = "number",
  String = "string",
  StringNumberMap = "string-number-map",
  LoraNumberMap = "lora-number-map",
  Model = "model",
  Image = "image",
  NumberPair = "number-pair",
  Sampler = "sampler",
}

const nodeEndpointTypeColorHueMap: Record<NodeEndpointType, number> = {
  [NodeEndpointType.Number]: 0,
  [NodeEndpointType.NumberPair]: 0,
  [NodeEndpointType.String]: 40,
  [NodeEndpointType.StringNumberMap]: 160,
  [NodeEndpointType.LoraNumberMap]: 200,
  [NodeEndpointType.Sampler]: 260,
  [NodeEndpointType.Model]: 260,
  [NodeEndpointType.Image]: 300,
};

const getEndpointStyle = (
  endpointType: keyof typeof nodeEndpointTypeColorHueMap
) =>
  // TODO: figure out why tailwind is not applying
  // tailwind`bg-[hsl(${nodeEndpointTypeColorHueMap[nodeType]} 50% 15%)]`;
  `hsl(${nodeEndpointTypeColorHueMap[endpointType]} 50% 15%)`;

export type NodeConfig = {
  inputs?: NodeEndpoint[];
  outputs?: NodeEndpoint[];
};

const Endpoints: FC<{
  endpointsConfig: NodeEndpoint[];
  position: "left" | "right";
  className: string;
}> = ({ endpointsConfig, className, position }) => (
  <div className={twMerge(`flex flex-col gap-2`, className)}>
    {endpointsConfig.map((endpointConfig, index) => (
      <div
        key={endpointConfig.id}
        className={twJoin(
          `flex flex-row gap-3 justify-start items-center`,
          position === "right" ? "flex-row-reverse" : ""
        )}
      >
        <Handle
          type={position === "left" ? "target" : "source"}
          position={position === "left" ? Position.Left : Position.Right}
          id={endpointConfig.id}
          key={endpointConfig.id}
          style={{
            backgroundColor: getEndpointStyle(endpointConfig.type),
          }}
        />
        <p className="text-neutral-500 text-xs">{endpointConfig.label}</p>
      </div>
    ))}
  </div>
);

const BaseNode: FC<
  NodeProps &
    PropsWithChildren<{
      label: string;
      config: NodeConfig;
    }>
> = ({ id, data, config, children, label }) => {
  return (
    <div
      className={twJoin(
        "py-5 bg-neutral-850 border-[1px] border-neutral-700 rounded grid gap-5",
        config.inputs && config.outputs ? "grid-cols-3" : "grid-cols-2",
        !config.inputs ? "pl-5" : "",
        !config.outputs ? "pr-5" : ""
      )}
    >
      {config.inputs ? (
        <Endpoints
          className="ml-[-10px] mt-8"
          position="left"
          endpointsConfig={config.inputs}
        />
      ) : null}

      <div className="flex flex-col gap-5 items-center">
        <p className="text-neutral-400 font-medium text-sm">{label}</p>
        {children}
      </div>

      {config.outputs ? (
        <Endpoints
          className="mr-[-10px] mt-8"
          position="right"
          endpointsConfig={config.outputs}
        />
      ) : null}
    </div>
  );
};

export default memo(BaseNode);
