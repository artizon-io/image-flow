import { useState, useMemo, useRef, useEffect } from "react";
import { configDir } from "@tauri-apps/api/path";
import Table from "./components/Table";
import SettingsDialog from "./components/Settings";
import "ninja-keys";
import _Notification, { useNotification } from "./components/Notification";
import * as RadixToast from "@radix-ui/react-toast";
import CommandPalette from "./components/CommandPalette";
import { Component1Icon } from "@radix-ui/react-icons";

const configDirPath = await configDir();

function App() {
  const [image, setImage] = useState<string | null>(null);

  const Notification = useMemo(() => _Notification, []);

  const showNotification = useNotification();

  return (
    <RadixToast.Provider swipeDirection="right">
      <RadixToast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] list-none z-10 outline-none" />
      <Notification />
      <CommandPalette />
      <div className="w-full h-full grid grid-cols-2 bg-neutral-900">
        <div className="overflow-auto">
          <Table setImage={setImage} />
        </div>
        <div className="flex overflow-auto justify-center bg-neutral-900">
          {image ? (
            <img src={image} className="self-center" />
          ) : (
            <p className="self-center text-neutral-500">No Image Selected</p>
          )}
        </div>
      </div>
      <div className="absolute top-3 right-5 flex flex-row gap-3">
        <SettingsDialog />
        <button className="naviconbutton">
          <Component1Icon className="w-5 h-5" />
        </button>
      </div>
    </RadixToast.Provider>
  );
}

export default App;
