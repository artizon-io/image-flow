type Metadata = ImageMetadata & {
  imageSrc: string;
  imageBaseDir: string;
};

type ImageMetadata = SDMetadata & {
  resolution: [number, number];
};

type SDMetadata = {
  prompt: string;
  modelName: string;
  modelVersion: string;
  seed: number;
};
