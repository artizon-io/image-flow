import { ChangeEventHandler, FC } from "react";
import { NodeProps, useUpdateNodeInternals } from "reactflow";
import BaseNode from "./Base";
import {
  imageOutputEndpointSchema,
  outputEndpointSchema,
  stringOutputEndpointSchema,
} from "./endpointSchemas";
import { textareaStyles } from "./styles";
import { useGraphStore } from "../Store";
import { z } from "zod";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

const createData = (imageSource?: string): NodeData => ({
  outputs: [
    {
      id: uuidv4(),
      label: "Image",
      data: {
        type: "image",
        colorHue: 300,
        source: imageSource,
      },
    },
  ],
});

const dataSchema = z.object({
  outputs: z.tuple([imageOutputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export { createData as createImageNodeData, dataSchema as imageNodeDataSchema };

export type { NodeData as ImageNodeData };

const ImageNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { outputs } = data;
  const image = outputs[0];
  const setNodeData = useGraphStore((state) => state.setNodeData);

  const selectImage = (source: string) => {
    setNodeData(
      id,
      produce(data, (draft) => {
        draft.outputs[0].data.source = source;
      })
    );
  };

  return (
    <BaseNode id={id} data={data} label="Image" {...props}>
      {image.data.source ? (
        <img src={image.data.source} />
      ) : (
        <div className="flex justify-center items-center w-[220px] h-[220px] bg-neutral-800 opacity-90">
          <p className="text-neutral-500 text-xs font-mono">No Image</p>
        </div>
      )}
    </BaseNode>
  );
};

export default ImageNode;
