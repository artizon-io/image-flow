import {
  useState,
  useMemo,
  FC,
  MouseEventHandler,
  MouseEvent,
  useEffect,
} from "react";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import {
  documentDir,
  desktopDir,
  pictureDir,
  configDir,
  sep,
} from "@tauri-apps/api/path";
import { readDir, BaseDirectory, exists } from "@tauri-apps/api/fs";
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import WeightMap from "./WeightMap";
import readImageMetadata from "../utils/readImageMetadata";
import { twJoin, twMerge } from "tailwind-merge";
import { useNotification } from "./Notification";
import useFetchImages from "../hooks/useFetchImages";

const documentDirPath = await documentDir();
const desktopDirPath = await desktopDir();
const pictureDirPath = await pictureDir();
const configDirPath = await configDir();

const Table: FC<{
  setImage: (image: string | null) => void;
}> = ({ setImage, ...props }) => {
  const columnHelper = createColumnHelper<Metadata>();

  const showNotification = useNotification();

  const columns = useMemo(
    () => [
      columnHelper.accessor("promptMap", {
        id: "prompt",
        header: "Prompt",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap weightMap={info.getValue()!} colorHue={220} />
          ) : (
            "N/A"
          ),
      }),
      columnHelper.accessor("negativePromptMap", {
        id: "negativePrompt",
        header: "Negative Prompt",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap weightMap={info.getValue()!} colorHue={0} />
          ) : (
            "N/A"
          ),
      }),
      columnHelper.accessor("modelName", {
        id: "modelName",
        header: "Model Name",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("modelVersion", {
        id: "modelVersion",
        header: "Model Version",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("resolution", {
        id: "resolution",
        header: "Resolution",
        cell: (info) => info.getValue().join("x"),
      }),
      columnHelper.accessor("seed", {
        id: "seed",
        header: "Seed",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor(
        (row) => `${row.imageBaseDir}${sep}${row.imageSrc}`,
        {
          id: "imageSrc",
          header: "Path",
          cell: (info) => info.getValue() ?? "N/A",
        }
      ),
      columnHelper.accessor("cfgScale", {
        id: "cfgScale",
        header: "CFG Scale",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("clipSkip", {
        id: "clipSkip",
        header: "Clip Skip",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("denoisingStrength", {
        id: "denoisingStrength",
        header: "Denoising Strength",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("highResResize", {
        id: "highResResize",
        header: "High Res Fix Resolution",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("highResSteps", {
        id: "highResSteps",
        header: "High Res Fix Steps",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("highResUpscaler", {
        id: "highResUpscaler",
        header: "High Res Upscaler",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("loraMap", {
        id: "lora",
        header: "Lora",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap weightMap={info.getValue()!} colorHue={220} />
          ) : (
            "N/A"
          ),
      }),
      columnHelper.accessor("negativeLoraMap", {
        id: "negativeLora",
        header: "Negative Lora",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap weightMap={info.getValue()!} colorHue={0} />
          ) : (
            "N/A"
          ),
      }),
      columnHelper.accessor("modelHash", {
        id: "modelHash",
        header: "Model Hash",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("sampler", {
        id: "sampler",
        header: "Sampler",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("steps", {
        id: "steps",
        header: "Steps",
        cell: (info) => info.getValue() ?? "N/A",
      }),
    ],
    []
  );

  const images = useFetchImages();

  const table = useReactTable({
    columns,
    data: images,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleClickRow = async (e: MouseEvent, row: Row<Metadata>) => {
    const imageSrc: string = row.getValue("imageSrc");
    // Convert to something that is loadable by system web view
    setImage(convertFileSrc(imageSrc));
  };

  const TableHeader = () => (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="bg-neutral-950">
          {headerGroup.headers.map((header) => (
            <th key={header.id} className="p-3 font-normal text-neutral-300">
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

  // TODO: Investigate performance cost
  const [hoverColumn, setHoverColumn] = useState<string | null>(null);
  const [hoverCell, setHoverCell] = useState<string | null>(null);

  const TableBody = () => (
    <tbody
      onMouseLeave={(e) => {
        setHoverColumn(null);
        setHoverCell(null);
      }}
    >
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={twJoin("cursor-pointer")}
          onClick={(e) => handleClickRow(e, row)}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={twJoin(
                "text-center p-3 font-light text-neutral-200 text-sm",
                hoverCell === cell.id
                  ? "shadow-solid-inset-1 shadow-neutral-500"
                  : "",
                hoverColumn === cell.column.id ? "" : ""
              )}
              onMouseOver={(e) => {
                setHoverColumn(cell.column.id);
                setHoverCell(cell.id);
              }}
            >
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
    <table
      className={`border-2 border-neutral-600 self-start table-auto`}
      {...props}
    >
      <TableHeader />
      <TableBody />
      <TableFooter />
    </table>
  );
};

export default Table;
