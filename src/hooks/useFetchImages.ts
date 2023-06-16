import { useCallback, useEffect, useState } from "react";
import readImageMetadata from "../utils/readImageMetadata";
import { useNotification } from "../components/Notification";
import { sep } from "@tauri-apps/api/path";
import { exists, readDir } from "@tauri-apps/api/fs";
import { useImageDirPathConfiguratorStore } from "../components/ImageDirPathConfigurator";

const useFetchImages = () => {
  const [images, setImages] = useState<Metadata[]>([]);
  const showNotification = useNotification();
  const imageDirs = useImageDirPathConfiguratorStore(
    (state) => state.imageDirs
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = useCallback(() => {
    const images: Metadata[] = [];

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
            let imageMetadata;
            // Wrap in try catch to prevent Tauri fs permission issues
            try {
              imageMetadata = await readImageMetadata(entry.path);
            } catch (err) {
              console.error(
                "Encoounter error while reading image metadata",
                err
              );
              showNotification(
                "Warning",
                `Encountered an error while trying to read ${entry.path}`
              );
            }

            if (!imageMetadata) return;

            console.debug("Entry", entry);
            console.debug("Image Metadata", imageMetadata);

            images.push({
              ...imageMetadata,
              imageBaseDir: imageDir,
              imageSrc: entry.name!,
            });
          })
        );
      })
    ).then(() => {
      console.info("Loaded images", images);
      setImages(images);
    });
  }, []);

  return images;
};

export default useFetchImages;
