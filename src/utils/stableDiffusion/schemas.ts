import { z } from "zod";

export const loraSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  hash: z.string().optional(),
});

export const modelSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  hash: z.string().optional(),
});

export const samplerSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  hash: z.string().optional(),
});
