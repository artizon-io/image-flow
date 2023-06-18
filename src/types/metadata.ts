type Metadata = ImageMetadata & {
  imageSrc: string;
  imageBaseDir: string;
};

type ImageMetadata = SDMetadata & {
  resolution: [number, number];
};

type SDMetadata = ModelParams & {
  promptMap: PromptMap | null;
  negativePromptMap: NegativePromptMap | null;
  prompt: Prompt | null;
  negativePrompt: NegativePrompt | null;
  loraMap: LoraMap | null;
  negativeLoraMap: NegativeLoraMap | null;
};

type Lora = string;
type LoraMap = WeightMap;
type NegativeLoraMap = WeightMap;

type Prompt = string;
type PromptMap = WeightMap;
type WeightMap = Map<Tag, Weight>;

type Tag = string;
type Weight = number;

type NegativePrompt = Prompt;
type NegativePromptMap = PromptMap;

// Omit<SDMetadata, "prompt"|"negativePrompt">
type ModelParams = {
  modelVersion: string | null;
  steps: number | null;
  sampler: string | null;
  cfgScale: number | null;
  seed: number | null;
  modelHash: string | null;
  modelName: string | null;
  denoisingStrength: number | null;
  clipSkip: number | null;
  highResResize: [number, number] | null;
  highResSteps: number | null;
  highResUpscaler: string | null;
};
