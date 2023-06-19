import { create } from "zustand";
import { useNotificationStore } from "../Notification/Store";
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
      // Note: `merge` is not intended to be used for serialization
      merge: (persisted, current) => {
        console.debug(
          "Merging Image Dirs from local storage",
          persisted,
          current
        );

        if (!persisted) return current;

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
          console.error(
            "Fail to parse image directories from local storage",
            parseResult.error.issues
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
