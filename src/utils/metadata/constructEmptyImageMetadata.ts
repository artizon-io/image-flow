const constructEmptyImageMetadata = (): ImageMetadata => ({
  modelName: null,
  modelVersion: null,
  seed: null,
  prompt: null,
  negativePrompt: null,
  cfgScale: null,
  clipSkip: null,
  denoisingStrength: null,
  highResResize: null,
  highResSteps: null,
  highResUpscaler: null,
  modelHash: null,
  sampler: null,
  steps: null,
  promptMap: null,
  negativePromptMap: null,
  resolution: [0, 0],
  loraMap: null,
  negativeLoraMap: null,
});

export default constructEmptyImageMetadata;
