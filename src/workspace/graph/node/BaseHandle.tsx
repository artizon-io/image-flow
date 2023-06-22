import { FC } from "react";
import { Handle, Position } from "reactflow";
import { twJoin } from "tailwind-merge";
import { Endpoint, InputEndpoint, OutputEndpoint } from "./endpoint";

const BaseHandle: FC<{
  endpointConfig: Endpoint;
}> = ({ endpointConfig }) => {
  const id = endpointConfig.id;
  const type = "data" in endpointConfig ? "source" : "target";
  const colorHue =
    type === "source"
      ? // @ts-ignore
        endpointConfig.data.colorHue
      : // @ts-ignore
        endpointConfig.type.colorHue;

  return (
    <Handle
      type={type}
      position={type === "target" ? Position.Left : Position.Right}
      id={id}
      // https://reactflow.dev/docs/api/nodes/handle/#validation
      // https://tailwindcss.com/docs/adding-custom-styles#arbitrary-variants
      className={twJoin(
        "border-neutral-500 w-[20px] h-[20px]",
        "[&.connecting]:border-neutral-500"
      )}
      style={{
        backgroundColor: `hsl(${colorHue} 50% 20%)`,
      }}
    />
  );
};

export default BaseHandle;
