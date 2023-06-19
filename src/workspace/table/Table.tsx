import { useState, useMemo, FC } from "react";
import { sep } from "@tauri-apps/api/path";
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import WeightMap from "../../components/WeightMap";
import { twJoin } from "tailwind-merge";
import { useNotification } from "../../singleton/Notification/Store";
import useImagesMetadata from "../../hooks/useImagesMetadata";
import { useSettingsStore } from "../../singleton/settings/Store";

// TODO: reduce re-renders
// TODO: render only visible rows using react-window or react-virtualized
// TODO: render in canvas
// TODO: use surreal-db locally

const Table: FC<{
  setImage?: (image: string | null) => void;
}> = ({ setImage, ...props }) => {
  const columnHelper = createColumnHelper<Metadata>();

  const showNotification = useNotification();
  const { positiveColorHue, negativeColorHue } = useSettingsStore((state) => ({
    positiveColorHue: state.positiveColorHue,
    negativeColorHue: state.negativeColorHue,
  }));

  const columns = useMemo(
    () => [
      columnHelper.accessor("promptMap", {
        id: "prompt",
        header: "Prompt",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap
              weightMap={info.getValue()!}
              colorHue={220}
            />
          ) : (
            "N/A"
          ),
      }),
      columnHelper.accessor("negativePromptMap", {
        id: "negativePrompt",
        header: "Negative Prompt",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap
              weightMap={info.getValue()!}
              colorHue={0}
            />
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
        header: "CLIP Skip",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("denoisingStrength", {
        id: "denoisingStrength",
        header: "Denoising Strength",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("highResResize", {
        id: "highResResize",
        header: "Highres Fix Resolution",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("highResSteps", {
        id: "highResSteps",
        header: "Highres Fix Steps",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("highResUpscaler", {
        id: "highResUpscaler",
        header: "Highres Sampler",
        cell: (info) => info.getValue() ?? "N/A",
      }),
      columnHelper.accessor("loraMap", {
        id: "lora",
        header: "Lora",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap
              weightMap={info.getValue()!}
              colorHue={220}
            />
          ) : (
            "N/A"
          ),
      }),
      columnHelper.accessor("negativeLoraMap", {
        id: "negativeLora",
        header: "Negative Lora",
        cell: (info) =>
          info.getValue() ? (
            <WeightMap
              weightMap={info.getValue()!}
              colorHue={0}
            />
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

  const imagesMetadata = useImagesMetadata();

  const table = useReactTable({
    columns,
    data: imagesMetadata,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectImage = async (row: Row<Metadata>) => {
    const imageSrc: string = row.getValue("imageSrc");
    setImage!(imageSrc);
  };

  const TableHeader = () => (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="bg-neutral-925">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="p-3 font-medium text-sm text-neutral-500"
            >
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
  // const [hoverColumn, setHoverColumn] = useState<string | null>(null);
  // const [hoverCell, setHoverCell] = useState<string | null>(null);
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  const TableBody = () => (
    <tbody
    // onMouseLeave={(e) => {
    //   setHoverColumn(null);
    //   setHoverCell(null);
    //   setHoverRow(null);
    // }}
    >
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={twJoin("cursor-pointer border-[1px] border-neutral-800")}
          onClick={(e) => (selectImage ? selectImage(row) : null)}
          onMouseOver={(e) => {
            setHoverRow(row.id);
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={twJoin(
                "text-center p-3 font-light text-neutral-200 text-sm",
                // hoverCell === cell.id
                //   ? "shadow-solid-inset-1 shadow-neutral-500"
                //   : "",
                // hoverColumn === cell.column.id ? "" : "",
                hoverRow === row.id ? "bg-neutral-850" : ""
              )}
              // onMouseOver={(e) => {
              //   setHoverColumn(cell.column.id);
              //   setHoverCell(cell.id);
              // }}
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

  if (imagesMetadata.length === 0)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-neutral-500">Cannot locate any images</p>
      </div>
    );

  return (
    <table className={`bg-neutral-900 border-collapse`} {...props}>
      <TableHeader />
      <TableBody />
      <TableFooter />
    </table>
  );
};

export default Table;
