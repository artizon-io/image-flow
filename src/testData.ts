import {
  documentDir,
  desktopDir,
  pictureDir,
  configDir,
} from "@tauri-apps/api/path";

const documentDirPath = await documentDir();

const testData: Metadata[] = [
  {
    prompt: "1girl",
    modelName: "MajicMix Realistic",
    modelVersion: "v5",
    resolution: [512, 512],
    seed: 12345678,
    imageSrc: "test.jpeg",
    imageBaseDir: documentDirPath,
  },
  {
    prompt: "anime girl",
    modelName: "MajicMix Realistic",
    modelVersion: "v5",
    resolution: [512, 768],
    seed: 12128812,
    imageSrc: "test.jpeg",
    imageBaseDir: documentDirPath,
  },
  {
    prompt: "1cat",
    modelName: "XXMix 9Realistic",
    modelVersion: "v2",
    resolution: [512, 512],
    seed: 32111211,
    imageSrc: "test.jpeg",
    imageBaseDir: documentDirPath,
  },
];

export default testData;
