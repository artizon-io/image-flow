import { FC, useEffect, useMemo } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, OutputEndpoint } from "./BaseHandle";
import { textareaStyles } from "./styles";
import { useGraphStore } from "../Store";

export type StringOutputNodeData = NodeData & {
  stringOutput?: string;
};

const StringOutputNode: FC<NodeProps<StringOutputNodeData>> = ({
  id,
  data,
  ...props
}) => {
  const initialData = useMemo(
    () => ({
      inputs: [
        {
          id: "string",
          label: "String",
          type: EndpointDataType.String,
          isConnectableTo(output: OutputEndpoint) {
            return output.type === this.type;
          },
        },
      ],
    }),
    []
  );

  const { inputs, stringOutput } = data;

  const setNodeData = useGraphStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeData<typeof initialData>(id, initialData);
  }, []);

  return (
    <BaseNode id={id} data={data} label="String Output" {...props}>
      <textarea
        value={stringOutput ?? "No Output"}
        className={textareaStyles}
        readOnly
      />
    </BaseNode>
  );
};

export default StringOutputNode;
