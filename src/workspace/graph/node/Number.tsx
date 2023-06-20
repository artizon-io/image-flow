import { ChangeEventHandler, FC, useEffect, useMemo } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, OutputEndpoint } from "./BaseHandle";
import { inputStyles } from "./styles";
import { useGraphStore } from "../Store";

export type NumberNodeData = NodeData & {
  initialValue?: number;
};

const NumberNode: FC<NodeProps<NumberNodeData>> = ({ id, data, ...props }) => {
  const initialData = useMemo(
    () =>
      ({
        outputs: [
          {
            id: "output-number",
            label: "Number",
            type: EndpointDataType.Number,
            value: 0,
          },
        ] as [OutputEndpoint],
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
          value: data.initialValue ?? 0,
        },
      ],
    });
  }, []);

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.debug(e.target.value);
    setNodeData(id, {
      ...data,
      outputs: [
        {
          ...outputs![0],
          value: parseInt(e.target.value),
        },
      ],
    });
  };

  if (!outputs) return null;

  return (
    <BaseNode id={id} data={data} label="Number" {...props}>
      <input
        className={inputStyles}
        type="number"
        onChange={handleValueChange}
        value={outputs![0].value}
      />
    </BaseNode>
  );
};

export default NumberNode;
