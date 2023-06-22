import { z } from "zod";

export type InputEndpoint = z.infer<typeof inputEndpointSchema>;

export type OutputEndpoint = z.infer<typeof outputEndpointSchema>;

export type Endpoint = InputEndpoint | OutputEndpoint;

// TODO: load the colors from `.config`

const inputEndpointBaseSchema = {
  id: z.string(),
  label: z.string(),
  edge: z.string().optional(),
};

const outputEndpointBaseSchema = {
  id: z.string(),
  label: z.string(),
};

export const stringType: z.infer<typeof stringInputEndpointSchema>["type"] = {
  type: "string",
  colorHue: 40,
};

export const stringData: z.infer<typeof stringOutputEndpointSchema>["data"] = {
  ...stringType,
  string: undefined as string | undefined,
};

export const stringInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("string"),
    colorHue: z.literal(40),
  }),
});

export const stringOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("string"),
    colorHue: z.literal(40),
    string: z.string().optional(),
  }),
});

export const numberType: z.infer<typeof numberInputEndpointSchema>["type"] = {
  type: "number",
  colorHue: 0,
};

export const numberData: z.infer<typeof numberOutputEndpointSchema>["data"] = {
  ...numberType,
  number: undefined as number | undefined,
};

export const numberInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("number"),
    colorHue: z.literal(0),
  }),
});

export const numberOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("number"),
    colorHue: z.literal(0),
    number: z.number().optional(),
  }),
});

export const numberPairType: z.infer<
  typeof numberPairInputEndpointSchema
>["type"] = {
  type: "number-pair",
  colorHue: 0,
};

export const numberPairData: z.infer<
  typeof numberPairOutputEndpointSchema
>["data"] = {
  ...numberPairType,
  pair: undefined as [number, number] | undefined,
};

export const numberPairInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("number-pair"),
    colorHue: z.literal(0),
  }),
});

export const numberPairOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("number-pair"),
    colorHue: z.literal(0),
    pair: z.tuple([z.number(), z.number()]).optional(),
  }),
});

export const stringNumberMapType: z.infer<
  typeof stringNumberMapInputEndpointSchema
>["type"] = {
  type: "string-number-map",
  colorHue: 160,
};

export const stringNumberMapData: z.infer<
  typeof stringNumberMapOutputEndpointSchema
>["data"] = {
  ...stringNumberMapType,
  map: undefined as Map<string, number> | undefined,
};

export const stringNumberMapInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("string-number-map"),
    colorHue: z.literal(160),
  }),
});

export const stringNumberMapOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("string-number-map"),
    colorHue: z.literal(160),
    map: z.map(z.string(), z.number()).optional(),
  }),
});

export const loraNumberMapType: z.infer<
  typeof loraNumberMapInputEndpointSchema
>["type"] = {
  type: "lora-number-map",
  colorHue: 200,
};

export const loraNumberMapData: z.infer<
  typeof loraNumberMapOutputEndpointSchema
>["data"] = {
  ...loraNumberMapType,
  map: undefined as Map<Lora, number> | undefined,
};

export const loraNumberMapInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("lora-number-map"),
    colorHue: z.literal(200),
  }),
});

export const loraNumberMapOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("lora-number-map"),
    colorHue: z.literal(200),
    map: z
      .map(
        z.object({
          name: z.string(),
          version: z.string().optional(),
          hash: z.string().optional(),
        }),
        z.number()
      )
      .optional(),
  }),
});

export const modelType: z.infer<typeof modelInputEndpointSchema>["type"] = {
  type: "model",
  colorHue: 260,
};

export const modelData: z.infer<typeof modelOutputEndpointSchema>["data"] = {
  ...modelType,
  data: undefined as Model | undefined,
};

export const modelInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("model"),
    colorHue: z.literal(260),
  }),
});

export const modelOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("model"),
    colorHue: z.literal(260),
    data: z
      .object({
        name: z.string(),
        version: z.string().optional(),
        hash: z.string().optional(),
      })
      .optional(),
  }),
});

export const imageType: z.infer<typeof imageInputEndpointSchema>["type"] = {
  type: "image",
  colorHue: 300,
};

export const imageData: z.infer<typeof imageOutputEndpointSchema>["data"] = {
  ...imageType,
  source: undefined as string | undefined,
};

export const imageInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("image"),
    colorHue: z.literal(300),
  }),
});

export const imageOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("image"),
    colorHue: z.literal(300),
    source: z.string().optional(),
  }),
});

export const samplerType: z.infer<typeof samplerInputEndpointSchema>["type"] = {
  type: "sampler",
  colorHue: 260,
};

export const samplerData: z.infer<typeof samplerOutputEndpointSchema>["data"] =
  {
    ...samplerType,
    name: undefined as string | undefined,
  };

export const samplerInputEndpointSchema = z.object({
  ...inputEndpointBaseSchema,
  type: z.object({
    type: z.literal("sampler"),
    colorHue: z.literal(260),
  }),
});

export const samplerOutputEndpointSchema = z.object({
  ...outputEndpointBaseSchema,
  data: z.object({
    type: z.literal("sampler"),
    colorHue: z.literal(260),
    name: z.string().optional(),
  }),
});

export const outputEndpointSchema = z.union([
  stringOutputEndpointSchema,
  numberOutputEndpointSchema,
  numberPairOutputEndpointSchema,
  stringNumberMapOutputEndpointSchema,
  loraNumberMapOutputEndpointSchema,
  modelOutputEndpointSchema,
  imageOutputEndpointSchema,
  samplerOutputEndpointSchema,
]);

export const inputEndpointSchema = z.union([
  stringInputEndpointSchema,
  numberInputEndpointSchema,
  numberPairInputEndpointSchema,
  stringNumberMapInputEndpointSchema,
  loraNumberMapInputEndpointSchema,
  modelInputEndpointSchema,
  imageInputEndpointSchema,
  samplerInputEndpointSchema,
]);
