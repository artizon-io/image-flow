import { useState, useMemo, FC, MouseEventHandler, MouseEvent } from "react";
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
import StructuredPrompt from "./StructuredPrompt";
import testData from "../testData";
import readImageMetadata from "../utils/readImageMetadata";

const documentDirPath = await documentDir();
const desktopDirPath = await desktopDir();
const pictureDirPath = await pictureDir();
const configDirPath = await configDir();

const Table: FC<{
  setImage: (image: string | null) => void;
}> = ({ setImage }) => {
  const columnHelper = createColumnHelper<Metadata>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("prompt", {
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
      columnHelper.accessor((row) => `${row.imageBaseDir}${row.imageSrc}`, {
        id: "imageSrc",
        header: "Path",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const loadAllImages = useMemo<Metadata[]>(() => {
    const images: Metadata[] = [];

    const baseDirs = [documentDirPath, desktopDirPath, pictureDirPath];
    baseDirs.forEach(async (baseDir) => {
      if (!(await exists(`${baseDir}test`))) return;

      const entries = await readDir(`${baseDir}test`);
      entries.forEach(async (entry) => {
        const imageMetadata = await readImageMetadata(entry.path);

        if (!imageMetadata) return;

        console.log("entry", entry);

        images.push({
          ...imageMetadata,
          imageBaseDir: baseDir,
          imageSrc: `test${sep}${entry.name}`,
        });
      });
    });

    console.log("images", images);
    return images;
  }, []);

  // const data = useMemo(() => testData, []);

  const table = useReactTable({
    columns,
    data: loadAllImages,
    // data: data,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleClickRow = async (e: MouseEvent, row: Row<Metadata>) => {
    const imageSrc: string = row.getValue("imageSrc");
    // Convert to something that is loadable by system web view
    const loadablePath = convertFileSrc(imageSrc);
    console.log("loadablePath", loadablePath);
    setImage(loadablePath);
  };

  console.log("Render Table", table.getRowModel().rows);

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
    <table className="border-2 border-neutral-200 self-start">
      <TableHeader />
      <TableBody />
      <TableFooter />
    </table>
  );
};

export default Table;
