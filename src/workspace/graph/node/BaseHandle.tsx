import { FC } from "react";
import { Handle, Position } from "reactflow";
import { twJoin } from "tailwind-merge";

export type NodeEndpoint = {
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
  // Tailwind doesn't support interpreted string
  // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
  `hsl(${nodeEndpointTypeColorHueMap[endpointType]} 50% 20%)`;

const BaseHandle: FC<{
  endpointConfig: NodeEndpoint;
  type: "input" | "output";
}> = ({ endpointConfig, type }) => {
  return (
    <Handle
      type={type === "input" ? "target" : "source"}
      position={type === "input" ? Position.Left : Position.Right}
      id={endpointConfig.id}
      // https://reactflow.dev/docs/api/nodes/handle/#validation
      // https://tailwindcss.com/docs/adding-custom-styles#arbitrary-variants
      className={twJoin(
        "border-neutral-500 w-[20px] h-[20px]",
        "[&.connecting]:border-neutral-500"
      )}
      style={{
        backgroundColor: getEndpointColor(endpointConfig.type),
      }}
      onConnect={(connection) => console.log("handle onConnect", connection)}
    />
  );
};

export default BaseHandle;
