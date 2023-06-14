import { exists, readBinaryFile, readTextFile } from "@tauri-apps/api/fs";
import * as ExifReader from "exifreader";
import parseAutomatic1111Metadata from "./automatic1111/parseAutomatic1111";

const parseSDMetadata = (rawSDMetadata: string): Promise<SDMetadata | null> => {
  return parseAutomatic1111Metadata(rawSDMetadata);
};

const getRawSDMetadata = (exifTags: ExifReader.Tags): string | null => {
  if (!exifTags.UserComment?.description) return null;

  let userCommentDescription = exifTags.UserComment.value as number[];
  // Using slice to trim off "UNICODE ("
  // and ignore every alternative codepoint (an encoding issue?)
  userCommentDescription = userCommentDescription
    .slice(9, -1)
    .reduce((acc: number[], codepoint, index) => {
      if (index % 2) return acc;
      acc.push(codepoint);
      return acc;
    }, []);

  // Convert byte code to String
  const rawSDMetadata = String.fromCharCode(...userCommentDescription);

  // Append the missing "}"
  return `${rawSDMetadata}}`;
};

const readImageMetadata = async (
  imagePath: string
): Promise<ImageMetadata | null> => {
  if (!(await exists(imagePath))) {
    return null;
  }

  if (
    !(
      imagePath.endsWith(".jpg") ||
      imagePath.endsWith(".jpeg") ||
      imagePath.endsWith(".png") ||
      imagePath.endsWith(".webp")
    )
  )
    return null;

  const content = await readBinaryFile(imagePath);
  const exifTags = ExifReader.load(content.buffer);
  console.log(exifTags);
  if (!exifTags.UserComment?.description) {
    return {
      prompt: null,
      negativePrompt: null,
      structuredPrompt: null,
      structuredNegativePrompt: null,
      modelName: null,
      modelVersion: null,
      resolution: [0, 0],
      seed: null,
    };
  }

  const rawSDMetadata = getRawSDMetadata(exifTags);
  if (!rawSDMetadata) {
    return {
      prompt: null,
      negativePrompt: null,
      structuredPrompt: null,
      structuredNegativePrompt: null,
      modelName: null,
      modelVersion: null,
      resolution: [0, 0],
      seed: null,
    };
  }

  console.log(rawSDMetadata);

  const sdMetadata = await parseSDMetadata(rawSDMetadata);
  if (!sdMetadata) {
    return {
      prompt: null,
      negativePrompt: null,
      structuredPrompt: null,
      structuredNegativePrompt: null,
      modelName: null,
      modelVersion: null,
      resolution: [0, 0],
      seed: null,
    };
  }

  return {
    ...sdMetadata,
    resolution: [0, 0],
  };
};

export default readImageMetadata;
