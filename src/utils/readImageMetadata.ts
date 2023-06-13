import { exists, readBinaryFile, readTextFile } from "@tauri-apps/api/fs";
import * as ExifReader from "exifreader";

const textEncoder = new TextEncoder();

const parseSDMetadata = (rawImageMetadata: string): SDMetadata => {
  return {
    modelName: "",
    modelVersion: "",
    prompt: "",
    seed: -1,
  };
};

const getRawSDMetadata = (exifTags: ExifReader.Tags): string | null => {
  if (!exifTags.UserComment?.description) return null;

  let userCommentDescription = exifTags.UserComment.value as number[];
  // Using slice to trim off "UNICODE ("
  userCommentDescription = userCommentDescription
    .slice(9, -1)
    .reduce((acc, codepoint, index) => {
      if (index % 2) return acc;
      acc.push(codepoint);
      return acc;
    }, []);

  // Convert byte code to String
  const rawSDMetadata = String.fromCharCode(...userCommentDescription);

  // Append the missing "}"
  return `${rawSDMetadata}}`;
};

const tryReadImageMetadata = async (
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
      prompt: "",
      modelName: "",
      modelVersion: "",
      resolution: [0, 0],
      seed: -1,
    };
  }

  const rawSDMetadata = getRawSDMetadata(exifTags);
  if (!rawSDMetadata) {
    return {
      prompt: "",
      modelName: "",
      modelVersion: "",
      resolution: [0, 0],
      seed: -1,
    };
  }

  console.log(rawSDMetadata);

  const sdMetadata = parseSDMetadata(rawSDMetadata);

  return {
    ...sdMetadata,
    resolution: [512, 512],
  };
};

export default tryReadImageMetadata;
