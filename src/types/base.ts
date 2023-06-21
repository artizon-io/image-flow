type LoraWeightMap = Map<Lora, number>;
type NegativeLoraWeightMap = LoraWeightMap;

type Prompt = string;
type PromptWeightMap = WeightMap;
type WeightMap = Map<Tag, Weight>;

type Tag = string;
type Weight = number;

type NegativePrompt = Prompt;
type NegativePromptWeightMap = PromptWeightMap;

type ModelParams = {
  model: Model | null;
  steps: number | null;
  sampler: Sampler | null;
  cfgScale: number | null;
  seed: number | null;
  denoisingStrength: number | null;
  clipSkip: number | null;
  highResResize: [number, number] | null;
  highResSteps: number | null;
  highResUpscaler: string | null;
};

type Model = {
  name: string;
  version?: string;
  hash?: string;
};

type Lora = {
  name: string;
  version?: string;
  hash?: string;
};

type Sampler = {
  name: string;
  version?: string;
  hash?: string;
};
