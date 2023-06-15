import { useState, useMemo } from "react";
import { configDir } from "@tauri-apps/api/path";
import Table from "./components/Table";
import SettingsDialog from "./components/Settings";
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  NO_GROUP,
} from "kbar";
import _Notification, { useNotification } from "./components/Notification";
import * as RadixToast from "@radix-ui/react-toast";

const configDirPath = await configDir();

function App() {
  const [image, setImage] = useState<string | null>(null);

  const Notification = useMemo(() => _Notification, []);

  const kbarActions = useMemo(
    () => [
      {
        id: "blog",
        name: "Blog",
        shortcut: ["b"],
        keywords: "writing words",
        perform: () => (window.location.pathname = "blog"),
      },
      {
        id: "contact",
        name: "Contact",
        shortcut: ["c"],
        keywords: "email",
        perform: () => (window.location.pathname = "contact"),
      },
    ],
    []
  );

  return (
    <RadixToast.Provider swipeDirection="right">
      <RadixToast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] list-none z-10 outline-none" />
      <Notification />
      <KBarProvider actions={kbarActions}>
        <KBarPortal>
          <KBarPositioner>
            <KBarAnimator>
              <KBarSearch />
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
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
        <SettingsDialog className="absolute top-2 right-5" />
      </KBarProvider>
    </RadixToast.Provider>
  );
}

export default App;
