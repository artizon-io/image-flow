import { FC, useEffect, useRef } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { inputStyles, labelStyles } from "./styles";
import { twoColumnGridStyles } from "./styles";
import { useGraphStore } from "../Store";
import { z } from "zod";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { numberPairOutputEndpointSchema } from "./endpoint";

const createData = (value?: [number, number]): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Number Pair",
      data: {
        type: "number-pair",
        colorHue: 0,
        pair: value ?? [0, 0],
      },
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([numberPairOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createNumberPairNodeData,
  dataSchema as numberPairNodeDataSchema,
};

export type { NodeData as NumberPairNodeData };

const NumberPairNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);
  const xRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const [x, y] = outputs[0].data.pair!;

  const handleValueChange = (type: "x" | "y", value: string) => {
    if (!xRef.current || !yRef.current) return;

    if (
      isNaN(parseFloat(xRef.current.value)) ||
      isNaN(parseFloat(yRef.current.value))
    )
      return;

    setNodeData(
      id,
      produce(data, (draft) => {
        if (type === "x") {
          draft.outputs[0].data.pair = [
            parseFloat(value),
            parseFloat(yRef.current!.value),
          ];
        } else {
          draft.outputs[0].data.pair = [
            parseFloat(xRef.current!.value),
            parseFloat(value),
          ];
        }
      })
    );
  };

  return (
    <BaseNode id={id} data={data} label="Number Pair" {...props}>
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>X:</label>
        <input
          className={inputStyles}
          type="number"
          ref={xRef}
          defaultValue={x}
          onChange={(e) => handleValueChange("x", e.target.value)}
        />
        <label className={labelStyles}>Y:</label>
        <input
          className={inputStyles}
          type="number"
          ref={yRef}
          defaultValue={y}
          onChange={(e) => handleValueChange("y", e.target.value)}
        />
      </div>
    </BaseNode>
  );
};

export default NumberPairNode;
