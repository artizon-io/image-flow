import { exists } from "@tauri-apps/api/fs";

const isImage = async (imagePath: string): Promise<boolean> => {
  if (!(await exists(imagePath))) {
    return false;
  }

  if (
    !(
      imagePath.endsWith(".jpg") ||
      imagePath.endsWith(".jpeg") ||
      imagePath.endsWith(".png") ||
      imagePath.endsWith(".webp")
    )
  )
    return false;

  return true;
};

export default isImage;
