import { z } from "zod";
import {
  loraSchema,
  modelSchema,
  samplerSchema,
} from "../stableDiffusion/schemas";

export const imageMetadataSchema = z.object({
  resolution: z.tuple([z.number(), z.number()]),
  model: modelSchema.nullable(),
  steps: z.number().nullable(),
  sampler: samplerSchema.nullable(),
  cfgScale: z.number().nullable(),
  seed: z.number().nullable(),
  denoisingStrength: z.number().nullable(),
  clipSkip: z.number().nullable(),
  highResResize: z.tuple([z.number(), z.number()]).nullable(),
  highResSteps: z.number().nullable(),
  highResUpscaler: samplerSchema.nullable(),
  promptMap: z.map(z.string(), z.number()).nullable(),
  negativePromptMap: z.map(z.string(), z.number()).nullable(),
  prompt: z.string().nullable(),
  negativePrompt: z.string().nullable(),
  loraMap: z.map(loraSchema, z.number()).nullable(),
  negativeLoraMap: z.map(loraSchema, z.number()).nullable(),
});
