import { FC, MouseEventHandler } from "react";
import { create } from "zustand";
import { useNotification } from "./Notification";
import { open } from "@tauri-apps/api/dialog";

export const useImageDirPathConfiguratorStore = create<{
  imageDirs: Set<string>;
  addImageDir: (imageDir: string) => boolean;
}>((set, get) => ({
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
}));

const ImageDirPathConfigurator: FC = ({}) => {
  const { imageDirs, addImageDir } = useImageDirPathConfiguratorStore(
    (state) => state
  );
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {[...imageDirs].map((imageDir) => (
          <div key={imageDir}>
            <p className="text-neutral-500 text-sm bg-neutral-800 rounded-sm py-1 px-2">
              {imageDir}
            </p>
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
