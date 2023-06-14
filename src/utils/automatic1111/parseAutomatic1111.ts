import * as ohm from "ohm-js";
import { resourceDir, sep } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";

const resourceDirPath = await resourceDir();

const parseAutomatic1111Metadata = async (
  rawImageMetadata: string
): Promise<SDMetadata | null> => {
  // Optional carriage return
  const result = rawImageMetadata.split(/\r?\n/);
  if (result.length !== 3) {
    return null;
  }
  const [prompt, negativePrompt, modelParams] = result;

  return {
    ...parseModelParams(modelParams),
    prompt: prompt,
    negativePrompt: negativePrompt,
    structuredPrompt: await parsePrompt(prompt),
    structuredNegativePrompt: parseNegativePrompt(negativePrompt),
  };
};

const parsePrompt = async (
  prompt: string
): Promise<StructuredPrompt | null> => {
  const grammarText = await readTextFile(
    `${resourceDirPath}automatic1111${sep}prompt.ohm`
  );
  const grammar = ohm.grammar(grammarText);
  // TODO: use matcher to incrementally match
  const match = grammar.match(prompt);
  if (match.failed()) return null;

  const semantics = grammar.createSemantics();
  semantics.addOperation("constructPrompt", {
    Prompt() {},
    Emphasized() {},
    Scheduled() {},
    Alternate() {},
    whiteapce() {},
    plain() {},
    number() {},
  });

  return null;
};

const parseNegativePrompt = (
  negativePrompt: string
): StructuredNegativePrompt | null => {
  if (!negativePrompt.startsWith("Negative prompt: ")) {
    return null;
  }
  return null;
};

const parseModelParams = (modelParams: string): ModelParams => {
  return {
    modelName: null,
    modelVersion: null,
    seed: null,
  };
};

export default parseAutomatic1111Metadata;
