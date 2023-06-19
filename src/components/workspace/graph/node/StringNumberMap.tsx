import { FC, useState } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeConfig } from "./Base";
import { NodeEndpointType } from "./BaseHandle";
import { inputStyles, twoColumnGridStyles } from "./styles";
import { twMerge } from "tailwind-merge";

export const config: NodeConfig = {
  outputs: [
    {
      id: "string-number-map",
      label: "String Number Map",
      type: NodeEndpointType.StringNumberMap,
      isConnectableTo(other) {
        return other.type === this.type;
      },
    },
  ],
};

export type NodeData = {
  value?: Map<string, number>;
};

const StringNumberMapNode: FC<NodeProps<NodeData>> = ({
  id,
  data,
  ...props
}) => {
  const [values, setValues] = useState<Map<string, number>>(
    data.value ?? new Map()
  );

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      label="String Number Map"
      {...props}
    >
      <div className={twMerge(twoColumnGridStyles, "gap-x-1 gap-y-2")}>
        {/* TODO: find a better key */}
        {[...values].map(([string, number], index) => (
          <Item
            key={index}
            string={string}
            number={number}
            setString={(newString) =>
              setValues((state) => {
                state.set(newString, number);
                state.delete(string);
                return state;
              })
            }
            setNumber={(newNumber) =>
              setValues((state) => {
                state.set(string, newNumber);
                return state;
              })
            }
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
