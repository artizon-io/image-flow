type Metadata = ImageMetadata & {
  imageSrc: string;
  imageBaseDir: string;
};

type ImageMetadata = SDMetadata & {
  resolution: [number, number];
};

type SDMetadata = ModelParams & {
  structuredPrompt: StructuredPrompt | null;
  structuredNegativePrompt: StructuredNegativePrompt | null;
  prompt: Prompt | null;
  negativePrompt: NegativePrompt | null;
};

type Prompt = string;
type StructuredPrompt = Map<PromptKeyword, PromptWeight>;

type PromptKeyword = string;
type PromptWeight = number;

type NegativePrompt = Prompt;
type StructuredNegativePrompt = StructuredPrompt;

// Omit<SDMetadata, "prompt"|"negativePrompt">
type ModelParams = {
  modelName: string | null;
  modelVersion: string | null;
  seed: number | null;
};
