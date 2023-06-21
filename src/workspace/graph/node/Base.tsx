import { FC, PropsWithChildren, memo } from "react";
import { NodeProps } from "reactflow";
import { twJoin, twMerge } from "tailwind-merge";
import BaseHandle from "./BaseHandle";
import { Endpoint, InputEndpoint, OutputEndpoint } from "./endpoint";

export type BaseNodeData = {
  inputs?: InputEndpoint[];
  outputs?: OutputEndpoint[];
};

const BaseHandles: FC<{
  endpointsConfig: InputEndpoint[] | OutputEndpoint[];
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
        <BaseHandle endpointConfig={endpointConfig} key={endpointConfig.id} />
        <p className="text-neutral-400 text-xs">{endpointConfig.label}</p>
      </div>
    ))}
  </div>
);

interface PropTypes extends NodeProps {
  label?: string;
  data: BaseNodeData;
}

const BaseNode: FC<PropsWithChildren<PropTypes>> = ({
  id,
  data,
  children,
  label,
}) => {
  const { inputs, outputs } = data;

  return (
    <div
      className={twJoin(
        "py-5 bg-neutral-850 border-2 border-neutral-700 rounded grid gap-5",
        inputs && outputs
          ? "grid-cols-[1fr_auto_1fr]"
          : "grid-cols-[auto_auto]",
        !inputs ? "pl-5" : "",
        !outputs ? "pr-5" : ""
      )}
    >
      {inputs ? (
        <BaseHandles
          className="ml-[-10px] mt-8"
          endpointsConfig={inputs}
          type="input"
        />
      ) : null}

      <div className="flex flex-col gap-5 items-center">
        {label ? (
          <p
            className={twJoin(
              "text-neutral-300 font-medium text-sm",
              !inputs ? "self-start" : "",
              !outputs ? "self-end" : ""
            )}
          >
            {label}
          </p>
        ) : null}
        {children}
      </div>

      {outputs ? (
        <BaseHandles
          className="mr-[-10px] mt-8"
          endpointsConfig={outputs}
          type="output"
        />
      ) : null}
    </div>
  );
};

export default memo(BaseNode);
