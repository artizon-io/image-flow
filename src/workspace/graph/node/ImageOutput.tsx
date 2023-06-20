import { FC, useEffect, useMemo } from "react";
import { NodeProps } from "reactflow";
import BaseNode, { NodeData } from "./Base";
import { EndpointDataType, InputEndpoint, OutputEndpoint } from "./BaseHandle";
import { useGraphStore } from "../Store";

export type ImageOutputNodeData = NodeData & {
  imageOutput?: string;
};

const ImageOutputNode: FC<NodeProps<ImageOutputNodeData>> = ({
  id,
  data,
  ...props
}) => {
  const initialData = useMemo(
    () =>
      ({
        inputs: [
          {
            id: "image",
            label: "Image",
            type: EndpointDataType.Image,
            isConnectableTo(output: OutputEndpoint) {
              return output.type === this.type;
            },
          },
        ] as [InputEndpoint],
      }),
    []
  );

  const { inputs, imageOutput } = data;

  const setNodeData = useGraphStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeData<typeof initialData>(id, initialData);
  }, []);

  return (
    <BaseNode id={id} data={data} label="Image Output" {...props}>
      {!!imageOutput ? (
        <img src={imageOutput} />
      ) : (
        <div className="flex justify-center items-center w-[220px] h-[220px] bg-neutral-800 opacity-90">
          <p className="text-neutral-500 text-xs font-mono">No Image</p>
        </div>
      )}
    </BaseNode>
  );
};

export default ImageOutputNode;
