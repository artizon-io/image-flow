import { FC, useEffect, useMemo, useRef } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, OutputEndpoint } from "./BaseHandle";
import { inputStyles, labelStyles } from "./styles";
import { twoColumnGridStyles } from "./styles";
import { useGraphStore } from "../Store";

export type NumberPairNodeData = NodeData & {
  initialValue?: [number, number];
};

const NumberPairNode: FC<NodeProps<NumberPairNodeData>> = ({
  id,
  data,
  ...props
}) => {
  const initialData = useMemo(
    () =>
      ({
        outputs: [
          {
            id: "output-number-pair",
            label: "Number Pair",
            type: EndpointDataType.NumberPair,
            value: [0, 0] as [number, number],
          },
        ] as [OutputEndpoint],
      }),
    []
  );

  const { outputs } = data;
  const setNodeData = useGraphStore((state) => state.setNodeData);
  const xRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNodeData<typeof initialData>(id, {
      ...initialData,
      outputs: [
        {
          ...initialData.outputs[0],
          value: data.initialValue ?? [0, 0],
        },
      ],
    });
  }, []);

  const handleValueChange = () => {
    if (!xRef.current || !yRef.current) return;

    setNodeData(id, {
      ...data,
      outputs: [
        {
          ...outputs![0],
          value: [parseInt(xRef.current.value), parseInt(yRef.current.value)],
        },
      ],
    });
  };

  if (!outputs) return null;

  return (
    <BaseNode id={id} data={data} label="Number Pair" {...props}>
      <div className={twoColumnGridStyles}>
        <label className={labelStyles}>X:</label>
        <input
          className={inputStyles}
          type="number"
          value={outputs![0].value[0]}
          ref={xRef}
          onChange={(e) => handleValueChange()}
        />
        <label className={labelStyles}>Y:</label>
        <input
          className={inputStyles}
          type="number"
          value={outputs![0].value[1]}
          ref={yRef}
          onChange={(e) => handleValueChange()}
        />
      </div>
    </BaseNode>
  );
};

export default NumberPairNode;
