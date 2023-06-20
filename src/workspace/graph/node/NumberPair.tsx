import { FC, useEffect, useRef } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import { EndpointDataType, outputEndpointSchema } from "./BaseHandle";
import { inputStyles, labelStyles } from "./styles";
import { twoColumnGridStyles } from "./styles";
import { useGraphStore } from "../Store";
import { z } from "zod";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

const createData = (value?: [number, number]): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Number Pair",
      type: EndpointDataType.NumberPair,
      value: value ?? [0, 0],
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([
    outputEndpointSchema.refine(
      (val) => val.type === EndpointDataType.NumberPair
    ),
  ]),
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

  const handleValueChange = (type: "x" | "y", value: string) => {
    if (!xRef.current || !yRef.current) return;

    setNodeData(
      id,
      produce(data, (draft) => {
        if (type === "x") {
          draft.outputs[0].value = [
            parseInt(value),
            parseInt(yRef.current!.value),
          ];
        } else {
          draft.outputs[0].value = [
            parseInt(xRef.current!.value),
            parseInt(value),
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
          value={isNaN(outputs[0].value[0]) ? 0 : outputs[0].value[0]}
          ref={xRef}
          onChange={(e) => handleValueChange("x", e.target.value)}
        />
        <label className={labelStyles}>Y:</label>
        <input
          className={inputStyles}
          type="number"
          value={isNaN(outputs[0].value[1]) ? 0 : outputs[0].value[1]}
          ref={yRef}
          onChange={(e) => handleValueChange("y", e.target.value)}
        />
      </div>
    </BaseNode>
  );
};

export default NumberPairNode;
