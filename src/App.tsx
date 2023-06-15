import { useState, useMemo, FC, MouseEventHandler, MouseEvent } from "react";
import { configDir } from "@tauri-apps/api/path";
import Table from "./components/Table";
import Settings from "./components/Settings";

const configDirPath = await configDir();

function App() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="w-full h-full grid grid-cols-2 bg-neutral-800">
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
  );
}

export default App;
