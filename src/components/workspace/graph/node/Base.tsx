import { FC, PropsWithChildren, memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  NodeProps,
} from "reactflow";
import { twJoin, twMerge } from "tailwind-merge";
import { tailwind } from "../../../../utils/tailwind";

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

// TODO: load the colors from `.config`

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

const getEndpointColor = (
  endpointType: keyof typeof nodeEndpointTypeColorHueMap
) =>
  // Tailwind doesn't support interpreted string(?)
  `hsl(${nodeEndpointTypeColorHueMap[endpointType]} 50% 20%)`;

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
            backgroundColor: getEndpointColor(endpointConfig.type),
          }}
        />
        <p className="text-neutral-400 text-xs">{endpointConfig.label}</p>
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
        "py-5 bg-neutral-850 border-2 border-neutral-700 rounded grid gap-5",
        config.inputs && config.outputs
          ? "grid-cols-[1fr_auto_1fr]"
          : "grid-cols-[auto_auto]",
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
        <p
          className={twJoin(
            "text-neutral-300 font-medium text-sm",
            !config.inputs ? "self-start" : "",
            !config.outputs ? "self-end" : ""
          )}
        >
          {label}
        </p>
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
