import { exists, readBinaryFile, readTextFile } from "@tauri-apps/api/fs";
import * as ExifReader from "exifreader";
import parseAutomatic1111Metadata from "./automatic1111/parseAutomatic1111";
import constructEmptyImageMetadata from "./constructEmptyImageMetadata";

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

  return rawSDMetadata;
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

  const imageMetadata = constructEmptyImageMetadata();

  const content = await readBinaryFile(imagePath);
  const exifTags = ExifReader.load(content.buffer);
  console.debug("ExifTags", exifTags);

  imageMetadata.resolution = [0, 0];

  if (!exifTags.UserComment?.description) {
    return imageMetadata;
  }

  const rawSDMetadata = getRawSDMetadata(exifTags);
  if (!rawSDMetadata) {
    return imageMetadata;
  }

  console.debug("RawSDMetadata", rawSDMetadata);

  const sdMetadata = await parseSDMetadata(rawSDMetadata);
  if (!sdMetadata) {
    return imageMetadata;
  }

  return { ...imageMetadata, ...sdMetadata };
};

export default readImageMetadata;
