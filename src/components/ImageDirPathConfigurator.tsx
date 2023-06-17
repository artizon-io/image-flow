import { FC, MouseEventHandler } from "react";
import { create } from "zustand";
import { useNotification, useNotificationStore } from "./Notification";
import { open } from "@tauri-apps/api/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { persist } from "zustand/middleware";
import { z } from "zod";

export const useImageDirPathConfiguratorStore = create<{
  imageDirs: Set<string>;
  addImageDir: (imageDir: string) => boolean;
  removeImageDir: (imageDir: string) => boolean;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}>()(
  // For more information about the `persist` middleware
  // https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md
  persist(
    (set, get) => ({
      imageDirs: new Set(),
      /**
       * Return True if the imageDir was added successfully, else return False
       * False is probably because the imageDir already exists
       */
      addImageDir: (imageDir: string) => {
        console.debug("Adding imageDir", imageDir);

        const currentImageDirs = get().imageDirs;
        console.debug("Current imageDirs", currentImageDirs);
        if (currentImageDirs.has(imageDir)) return false;
        set((state) => ({
          ...state,
          imageDirs: new Set([...state.imageDirs, imageDir]),
        }));
        return true;
      },
      /**
       * Return True if the imageDir was removed successfully, else return False
       * False is probably because the imageDir doesn't exist
       */
      removeImageDir: (imageDir: string) => {
        console.debug("Removing imageDir", imageDir);

        const currentImageDirs = get().imageDirs;
        if (!currentImageDirs.has(imageDir)) return false;
        set((state) => ({
          ...state,
          imageDirs: new Set(
            [...state.imageDirs].filter((dir) => dir !== imageDir)
          ),
        }));
        return true;
      },
      hydrated: false,
      setHydrated: (state) => {
        set({
          hydrated: state,
        });
      },
    }),
    {
      name: "image-dirs-storage",
      partialize: (state) => ({ imageDirs: [...state.imageDirs] }),
      merge: (persisted, current) => {
        console.debug(
          "Merging Image Dirs from local storage",
          persisted,
          current
        );

        const parseResult = z
          .object({
            imageDirs: z.array(z.string()),
          })
          .safeParse(persisted);

        if (!parseResult.success) {
          useNotificationStore
            .getState()
            .showNotification(
              "Warning",
              "Fail to load image directories from local storage"
            );
          return current;
        }

        const merged = new Set([
          ...current.imageDirs,
          ...parseResult.data.imageDirs,
        ]);
        return { ...current, imageDirs: merged };
      },
      // Check if store is hydrated
      // https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#how-can-i-check-if-my-store-has-been-hydrated
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true);
      },
    }
  )
);

const ImageDirPathConfigurator: FC = ({}) => {
  const { imageDirs, addImageDir, removeImageDir } =
    useImageDirPathConfiguratorStore((state) => state);
  const showNotification = useNotification();

  const openDialog: MouseEventHandler = async () => {
    const selected = await open({
      directory: true,
      title: "Images Location",
    });

    if (!selected) return;

    if (Array.isArray(selected)) {
      console.warn("Multiple directories selected", selected);
      return;
    }

    const addSuccess = addImageDir(selected);
    if (!addSuccess)
      showNotification("Error", "Image Directory already exists");
  };

  const tryRemoveImageDir = (imageDir: string) => {
    const removeSuccess = removeImageDir(imageDir);
    if (!removeSuccess)
      showNotification("Error", "Fail to remove Image Directory");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {[...imageDirs].map((imageDir) => (
          <div key={imageDir} className="flex flex-row gap-1">
            <p className="text-neutral-500 text-sm bg-neutral-800 rounded-sm py-1 px-2 flex-1">
              {imageDir}
            </p>
            <button
              className="rounded-sm px-1 hover:border-neutral-600 bg-neutral-800 text-neutral-500"
              onClick={(e) => tryRemoveImageDir(imageDir)}
            >
              <Cross2Icon />
            </button>
          </div>
        ))}
      </div>
      <button
        className="text-xs bg-neutral-800 hover:bg-neutral-900 shadow-none border-2 hover:border-neutral-800 rounded-md self-start px-3 py-2 text-neutral-300"
        onClick={openDialog}
      >
        Add New Location
      </button>
    </div>
  );
};

export default ImageDirPathConfigurator;
