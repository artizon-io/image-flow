import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import {} from "./BaseHandle";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  imageData,
  imageInputEndpointSchema,
  imageOutputEndpointSchema,
} from "./endpoint";

const createData = (): NodeData => ({
  imageOutput: {
    id: uuidv4(),
    label: "Image",
    data: {
      type: "image",
      colorHue: 300,
    },
  },
  inputs: [
    {
      id: uuidv4(),
      label: "Image",
      type: {
        type: "image",
        colorHue: 300,
      },
    },
  ],
});

const dataSchema = z.object({
  imageOutput: imageOutputEndpointSchema,
  inputs: z.tuple([imageInputEndpointSchema]),
});

type NodeData = z.infer<typeof dataSchema>;

export {
  createData as createImageOutputNodeData,
  dataSchema as imageOutputNodeDataSchema,
};

export type { NodeData as ImageOutputNodeData };

const ImageOutputNode: FC<NodeProps<NodeData>> = ({ id, data, ...props }) => {
  const { inputs, imageOutput } = data;

  return (
    <BaseNode id={id} data={data} label="Image Output" {...props}>
      {imageOutput.data.source ? (
        <img src={imageOutput.data.source} />
      ) : (
        <div className="flex justify-center items-center w-[220px] h-[220px] bg-neutral-800 opacity-90">
          <p className="text-neutral-500 text-xs font-mono">No Image</p>
        </div>
      )}
    </BaseNode>
  );
};

export default ImageOutputNode;
