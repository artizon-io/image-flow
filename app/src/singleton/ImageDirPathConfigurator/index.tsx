import { FC, MouseEventHandler } from "react";
import { useNotification } from "../Notification/Store";
import { open } from "@tauri-apps/api/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useImageDirPathConfiguratorStore } from "./Store";

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
