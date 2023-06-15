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
        cell: (info) => <WeightMap>{info.getValue()}</WeightMap>,
        header: "Prompt",
      }),
      columnHelper.accessor("negativePrompt", {
        id: "negativePrompt",
        cell: (info) => <WeightMap>{info.getValue()}</WeightMap>,
        header: "Negative Prompt",
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
      columnHelper.accessor("cfgScale", {
        id: "cfgScale",
        header: "CFG Scale",
      }),
      columnHelper.accessor("clipSkip", {
        id: "clipSkip",
        header: "Clip Skip",
      }),
      columnHelper.accessor("denoisingStrength", {
        id: "denoisingStrength",
        header: "Denoising Strength",
      }),
      columnHelper.accessor("highResResize", {
        id: "highResResize",
        header: "High Res Fix Resolution",
      }),
      columnHelper.accessor("highResSteps", {
        id: "highResSteps",
        header: "High Res Fix Steps",
      }),
      columnHelper.accessor("highResUpscaler", {
        id: "highResUpscaler",
        header: "High Res Upscaler",
      }),
      columnHelper.accessor("loraMap", {
        id: "lora",
        header: "Lora",
        cell: (info) => <WeightMap>{info.getValue()}</WeightMap>,
      }),
      columnHelper.accessor("negativeLoraMap", {
        id: "negativeLora",
        header: "Negative Lora",
        cell: (info) => <WeightMap>{info.getValue()}</WeightMap>,
      }),
      columnHelper.accessor("modelHash", {
        id: "modelHash",
        header: "Model Hash",
      }),
      columnHelper.accessor("sampler", {
        id: "sampler",
        header: "Sampler",
      }),
      columnHelper.accessor("steps", {
        id: "steps",
        header: "Steps",
      }),
    ],
    []
  );

  const [images, setImages] = useState<Metadata[]>([]);

  const fetchImages = (): void => {
    const images: Metadata[] = [];

    const baseDirs = [documentDirPath, desktopDirPath, pictureDirPath];
    // Why not forEach async (because it will cause a bunch of re-renders)
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    Promise.all(
      baseDirs.map(async (baseDir) => {
        if (!(await exists(`${baseDir}test`))) return;

        const entries = await readDir(`${baseDir}test`);
        await Promise.all(
          entries.map(async (entry) => {
            let imageMetadata;
            // Wrap in try catch to prevent Tauri fs permission issues
            try {
              imageMetadata = await readImageMetadata(entry.path);
            } catch (err) {
              console.error(
                "Encoounter error while reading image metadata",
                err
              );
            }

            if (!imageMetadata) return;

            console.debug("Entry", entry);
            console.info("Image Metadata", imageMetadata);

            images.push({
              ...imageMetadata,
              imageBaseDir: baseDir,
              imageSrc: `test${sep}${entry.name}`,
            });
          })
        );
      })
    ).then(() => {
      console.info("Images", images);
      setImages(images);
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // const data = useMemo(() => testData, []);

  const table = useReactTable({
    columns,
    data: images,
    // data: data,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleClickRow = async (e: MouseEvent, row: Row<Metadata>) => {
    const imageSrc: string = row.getValue("imageSrc");
    // Convert to something that is loadable by system web view
    setImage(convertFileSrc(imageSrc));
  };

  console.debug("Render Table", table.getRowModel().rows);

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
