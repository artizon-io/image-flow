import { FC } from "react";
import { NodeProps } from "reactflow";
import BaseNode from "./Base";
import {
  EndpointDataType,
  OutputEndpoint,
  inputEndpointSchema,
} from "./BaseHandle";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const createData = (): NodeData => ({
  imageOutput: "",
  inputs: [
    {
      id: uuidv4(),
      label: "Image",
      type: EndpointDataType.Image,
    },
  ],
});

const dataSchema = z.object({
  imageOutput: z.string(),
  inputs: z.tuple([
    inputEndpointSchema.refine((val) => val.type === EndpointDataType.Image),
  ]),
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
