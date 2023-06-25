type ImageMetadataWithPath = ImageMetadata & {
  imageSrc: string;
  imageBaseDir: string;
};

type ImageMetadata = SDMetadata & {
  resolution: [number, number];
};

type SDMetadata = {
  model: Model | null;
  steps: number | null;
  sampler: Sampler | null;
  cfgScale: number | null;
  seed: number | null;
  denoisingStrength: number | null;
  clipSkip: number | null;
  highResResize: [number, number] | null;
  highResSteps: number | null;
  highResUpscaler: Sampler | null;
  promptMap: PromptWeightMap | null;
  negativePromptMap: NegativePromptWeightMap | null;
  prompt: Prompt | null;
  negativePrompt: NegativePrompt | null;
  loraMap: LoraWeightMap | null;
  negativeLoraMap: NegativeLoraWeightMap | null;
};
