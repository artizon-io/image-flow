import { ChangeEventHandler, FC, useEffect, useMemo } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, OutputEndpoint } from "./BaseHandle";
import { textareaStyles } from "./styles";
import { useGraphStore } from "../Store";

export type StringNodeData = NodeData & {
  initialValue?: string;
};

const StringNode: FC<NodeProps<StringNodeData>> = ({ id, data, ...props }) => {
  const initialData = useMemo(
    () => ({
      outputs: [
        {
          id: "output-string",
          label: "String",
          type: EndpointDataType.String,
          value: "" as string,
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
          value: data.initialValue ?? "",
        },
      ],
    });
  }, []);

  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setNodeData(id, {
      ...data,
      outputs: [
        {
          ...outputs![0],
          value: e.target.value,
        },
      ],
    });
  };

  if (!outputs) return null;

  return (
    <BaseNode id={id} data={data} label="String" {...props}>
      <textarea
        className={textareaStyles}
        value={outputs![0].value}
        onChange={handleValueChange}
      />
    </BaseNode>
  );
};

export default StringNode;
