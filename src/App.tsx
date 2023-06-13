import { useState, useMemo, FC, MouseEventHandler, MouseEvent } from "react";
import { configDir } from "@tauri-apps/api/path";
import Table from "./Table";

const configDirPath = await configDir();

function App() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="w-full h-full grid grid-rows-2 gap-4 bg-neutral-800">
      <div className="p-12 overflow-auto flex">
        <Table setImage={setImage} />
      </div>
      <div className="flex overflow-auto">
        {image ? <img src={image} className="self-center" /> : null}
      </div>
    </div>
  );
}

export default App;
