const parseAutomatic1111Metadata = (
  rawImageMetadata: string
): SDMetadata | null => {
  // Optional carriage return
  const result = rawImageMetadata.split(/\r?\n/);
  if (result.length !== 3) {
    return null;
  }
  const [prompt, negativePrompt, modelParams] = result;

  return {
    ...parseModelParams(modelParams),
    prompt: parsePrompt(prompt),
    negativePrompt: parseNegativePrompt(negativePrompt),
  };
};

const parsePrompt = (prompt: string): Prompt | null => {
  return null;
};

const parseNegativePrompt = (negativePrompt: string): NegativePrompt | null => {
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
