import { useState, useMemo, FC, MouseEventHandler, MouseEvent } from "react";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StructuredPrompt from "./StructuredPrompt";
import { open } from "@tauri-apps/api/dialog";

type Metadata = {
  prompt: string;
  modelName: string;
  modelVersion: string;
  resolution: [number, number];
  seed: number;
  imageSrc: string;
};

const testData: Metadata[] = [
  {
    prompt: "1girl",
    modelName: "MajicMix Realistic",
    modelVersion: "v5",
    resolution: [512, 512],
    seed: 12345678,
    imageSrc:
      "D:\\Stable-Diffusion\\Output\\Reference\\MajicMix\\00015-3484539024.jpeg",
  },
  {
    prompt: "anime girl",
    modelName: "MajicMix Realistic",
    modelVersion: "v5",
    resolution: [512, 768],
    seed: 12128812,
    imageSrc:
      "D:\\Stable-Diffusion\\Output\\Reference\\MajicMix\\00015-3484539024.jpeg",
  },
  {
    prompt: "1cat",
    modelName: "XXMix 9Realistic",
    modelVersion: "v2",
    resolution: [512, 512],
    seed: 32111211,
    imageSrc:
      "D:\\Stable-Diffusion\\Output\\Reference\\MajicMix\\00015-3484539024.jpeg",
  },
];

function App() {
  const data = useMemo(() => testData, []);

  const columnHelper = createColumnHelper<Metadata>();

  const [image, setImage] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.prompt, {
        id: "prompt",
        cell: (info) => <StructuredPrompt>{info.getValue()}</StructuredPrompt>,
        header: "Prompt",
      }),
      columnHelper.accessor("modelName", {
        id: "modelName",
        header: "Model Name",
      }),
      columnHelper.accessor("modelVersion", {
        id: "modelVersion",
        header: "Model Version",
      }),
      columnHelper.accessor("resolution", {
        id: "resolution",
        header: "Resolution",
        cell: (info) => info.getValue().join("x"),
      }),
      columnHelper.accessor("seed", {
        id: "seed",
        header: "Seed",
      }),
      columnHelper.accessor("imageSrc", {
        id: "imageSrc",
        header: "Location ",
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const TableHeader = () => (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} className="p-3">
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );

  const handleClickRow = (e: MouseEvent, row: Row<Metadata>) => {
    const imageSrc: string = row.getValue("imageSrc");
    setImage(convertFileSrc(imageSrc as string));
  };

  const TableBody = () => (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="hover:bg-neutral-700 cursor-pointer"
          onClick={(e) => handleClickRow(e, row)}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="text-center p-3">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const TableFooter = () => (
    <tfoot>
      {table.getFooterGroups().map((footerGroup) => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </tfoot>
  );

  return (
    <div className="w-full h-full grid grid-rows-2 gap-4 bg-neutral-800">
      <div className="p-12 overflow-auto flex">
        <table className="border-2 border-neutral-200 self-start">
          <TableHeader />
          <TableBody />
          <TableFooter />
        </table>
      </div>
      <div className="bg-neutral-200 flex overflow-auto">
        {image ? <img src={image} className="self-center" /> : null}
      </div>
    </div>
  );
}

export default App;
