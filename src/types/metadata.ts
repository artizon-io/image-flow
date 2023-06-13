type Metadata = ImageMetadata & {
  imageSrc: string;
  imageBaseDir: string;
};

type ImageMetadata = SDMetadata & {
  resolution: [number, number];
};

type SDMetadata = ModelParams & {
  prompt: Prompt | null;
  negativePrompt: NegativePrompt | null;
};

type Prompt = [PromptKeyword, PromptWeight][];

type PromptKeyword = string;
type PromptWeight = number;

type NegativePrompt = Prompt;

// Omit<SDMetadata, "prompt"|"negativePrompt">
type ModelParams = {
  modelName: string | null;
  modelVersion: string | null;
  seed: number | null;
};
