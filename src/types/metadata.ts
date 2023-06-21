type Metadata = ImageMetadata & {
  imageSrc: string;
  imageBaseDir: string;
};

type ImageMetadata = SDMetadata & {
  resolution: [number, number];
};

type SDMetadata = ModelParams & {
  promptMap: PromptWeightMap | null;
  negativePromptMap: NegativePromptWeightMap | null;
  prompt: Prompt | null;
  negativePrompt: NegativePrompt | null;
  loraMap: LoraWeightMap | null;
  negativeLoraMap: NegativeLoraWeightMap | null;
};
