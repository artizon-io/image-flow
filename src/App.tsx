import { useState, useMemo, FC, MouseEventHandler, MouseEvent } from "react";
import { configDir } from "@tauri-apps/api/path";
import Table from "./components/Table";
import Settings from "./components/Settings";
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  NO_GROUP,
} from "kbar";

const configDirPath = await configDir();

function App() {
  const [image, setImage] = useState<string | null>(null);

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
          <Settings className="self-center absolute top-5 right-5" />
        </div>
      </div>
    </KBarProvider>
  );
}

export default App;
