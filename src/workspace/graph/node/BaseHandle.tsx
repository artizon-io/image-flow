import { FC } from "react";
import { Handle, Position } from "reactflow";
import { twJoin } from "tailwind-merge";
import { z } from "zod";

export type InputEndpoint = z.infer<typeof inputEndpointSchema>;

export type OutputEndpoint = z.infer<typeof outputEndpointSchema>;

export enum EndpointDataType {
  Number = "number",
  String = "string",
  StringNumberMap = "string-number-map",
  LoraNumberMap = "lora-number-map",
  Model = "model",
  Image = "image",
  NumberPair = "number-pair",
  Sampler = "sampler",
}

const endpointSchema = z.union([
  z.nativeEnum(EndpointDataType),
  z.set(z.nativeEnum(EndpointDataType)),
]);

type EndpointType = z.infer<typeof endpointSchema>;

export const outputEndpointSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    type: endpointSchema,
    value: z.any(),
  })
  .refine((val) => {
    switch (val.type) {
      case EndpointDataType.Number:
        return typeof val.value === "number";
      case EndpointDataType.String:
        return typeof val.value === "string";
    }
  });

export const inputEndpointSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: endpointSchema,
});

// TODO: load the colors from `.config`

const dataTypeColorHueMap: Record<EndpointDataType, number> = {
  [EndpointDataType.Number]: 0,
  [EndpointDataType.NumberPair]: 0,
  [EndpointDataType.String]: 40,
  [EndpointDataType.StringNumberMap]: 160,
  [EndpointDataType.LoraNumberMap]: 200,
  [EndpointDataType.Sampler]: 260,
  [EndpointDataType.Model]: 260,
  [EndpointDataType.Image]: 300,
};

const getEndpointColor = (endpointType: EndpointType): string => {
  if (!endpointType) return `hsl(0 0% 15%)`;
  else if (endpointType instanceof Set) return `hsl(0 0% 25%)`;
  else if (endpointType in dataTypeColorHueMap)
    return `hsl(${dataTypeColorHueMap[endpointType]} 50% 20%)`;
  else throw Error(`Unknown endpoint type ${endpointType}`);
};

const BaseHandle: FC<{
  endpointConfig: InputEndpoint | OutputEndpoint;
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
