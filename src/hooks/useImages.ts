import { useEffect, useState } from "react";
import { useNotification } from "../components/singleton/Notification/Store";
import { exists, readDir } from "@tauri-apps/api/fs";
import { useImageDirPathConfiguratorStore } from "../components/singleton/ImageDirPathConfigurator/Store";
import isImage from "../utils/isImage";

// TODO: refactor this with the useImageMetadata hook

const useImages = () => {
  const [images, setImages] = useState<string[]>([]);
  const showNotification = useNotification();
  const imageDirs = useImageDirPathConfiguratorStore(
    (state) => state.imageDirs
  );

  useEffect(() => {
    console.debug("Detecting image dirs changes", imageDirs);
    fetchImages();
  }, [imageDirs]);

  const fetchImages = () => {
    const images: string[] = [];

    // Why not forEach async (because it will cause a bunch of re-renders)
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    // TODO: make it incremental (at least give user the option to do so)
    Promise.all(
      [...imageDirs].map(async (imageDir) => {
        if (!(await exists(imageDir))) {
          showNotification(
            "Warning",
            `Image directory ${imageDir} does not exist`
          );
          return;
        }

        const entries = await readDir(imageDir);
        await Promise.all(
          entries.map(async (entry) => {
            let isValidImage = false;
            // Wrap in try catch to prevent Tauri fs permission issues
            try {
              isValidImage = await isImage(entry.path);
            } catch (err) {
              console.error(
                `Encountered an error while trying to determine if ${entry.path} is an image`,
                err
              );
              showNotification(
                "Warning",
                `Encountered an error while trying to determine if ${entry.path} is an image`
              );
            }

            if (!isValidImage) return;

            console.debug("Image", entry.path);

            images.push(entry.path);
          })
        );
      })
    ).then(() => {
      console.info("Loaded images", images);
      setImages(images);
    });
  };

  return images;
};

export default useImages;
