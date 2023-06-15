import { useState, useMemo, FC, MouseEventHandler, MouseEvent } from "react";
import { configDir } from "@tauri-apps/api/path";
import Table from "./components/Table";

const configDirPath = await configDir();

function App() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="w-full h-full grid grid-cols-2 bg-neutral-800">
      <div className="overflow-auto">
        <Table setImage={setImage} />
      </div>
      <div className="flex overflow-auto justify-center bg-neutral-900">
        {image ? <img src={image} className="self-center" /> : null}
      </div>
    </div>
  );
}

export default App;
