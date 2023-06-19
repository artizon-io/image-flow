import { FC, PropsWithChildren, memo } from "react";
import { NodeProps } from "reactflow";
import { twJoin, twMerge } from "tailwind-merge";
import BaseHandle, { NodeEndpoint } from "./BaseHandle";

export type NodeConfig = {
  inputs?: NodeEndpoint[];
  outputs?: NodeEndpoint[];
};

const Endpoints: FC<{
  endpointsConfig: NodeEndpoint[];
  type: "input" | "output";
  className: string;
}> = ({ endpointsConfig, className, type }) => (
  <div className={twMerge(`flex flex-col gap-2`, className)}>
    {endpointsConfig.map((endpointConfig, index) => (
      <div
        key={endpointConfig.id}
        className={twJoin(
          `flex flex-row gap-3 justify-start items-center`,
          type === "output" ? "flex-row-reverse" : ""
        )}
      >
        <BaseHandle
          endpointConfig={endpointConfig}
          type={type}
          key={endpointConfig.id}
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
          type="input"
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
          type="output"
          endpointsConfig={config.outputs}
        />
      ) : null}
    </div>
  );
};

export default memo(BaseNode);
