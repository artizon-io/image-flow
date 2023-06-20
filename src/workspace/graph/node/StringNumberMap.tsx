import { FC, useEffect, useMemo, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, InputEndpoint } from "./BaseHandle";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";
import { useGraphStore } from "../Store";

export type StringNumberMapNodeData = NodeData & {
  initialValue?: Map<string, number>;
};

const StringNumberMapNode: FC<NodeProps<StringNumberMapNodeData>> = ({
  id,
  data,
  ...props
}) => {
  const initialData = useMemo(
    () => ({
      outputs: [
        {
          id: "string-number-map",
          label: "String Number Map",
          type: EndpointDataType.StringNumberMap,
          value: new Map() as Map<string, number>,
        },
      ],
    }),
    []
  );

  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeData<typeof initialData>(id, {
      ...initialData,
      outputs: [
        {
          ...initialData.outputs[0],
          value: data.initialValue ?? new Map(),
        },
      ],
    });
  }, []);

  if (!outputs) return null;

  return (
    <BaseNode id={id} data={data} label="String Number Map" {...props}>
      <div className={twMerge(twoColumnGridStyles, "gap-x-1 gap-y-2")}>
        {/* TODO: find a better key */}
        {[...outputs![0].value].map(([string, number], index) => (
          <Item
            key={index}
            string={string}
            number={number}
            setString={(newString) => {
              outputs![0].value.set(newString, number);
              outputs![0].value.delete(string);
              setNodeData(id, {
                ...data,
              });
            }}
            setNumber={(newNumber) => {
              outputs![0].value.set(string, newNumber);
              setNodeData(id, {
                ...data,
              });
            }}
          />
        ))}
      </div>
    </BaseNode>
  );
};

const Item: FC<{
  string: string;
  number: number;
  setString: (string: string) => void;
  setNumber: (number: number) => void;
}> = ({ string, number, setString, setNumber }) => (
  <>
    <input
      className={inputStyles}
      value={string}
      onChange={(e) => setString(e.target.value)}
    />
    <input
      className={inputStyles}
      value={number}
      type="number"
      onChange={(e) => setNumber(parseInt(e.target.value))}
    />
  </>
);

export default StringNumberMapNode;
