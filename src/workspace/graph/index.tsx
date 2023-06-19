import { FC } from "react";
import ReactFlow, { Background, SelectionMode } from "reactflow";
import { twMerge } from "tailwind-merge";
import "reactflow/dist/style.css";
import "./react-flow.css";
import type { NodeData as ModelNodeData } from "./node/Model";
import type { NodeData as Automatic1111NodeData } from "./node/Automatic1111";
import type { NodeData as NumberNodeData } from "./node/Number";
import type { NodeData as StringNodeData } from "./node/String";
import type { NodeData as ImageOutputNodeData } from "./node/ImageOutput";
import type { NodeData as TextOutputNodeData } from "./node/StringOutput";
import type { NodeData as NumberPairNodeData } from "./node/NumberPair";
import type { NodeData as StringNumberMapNodeData } from "./node/StringNumberMap";
import type { NodeData as LoraNumberMapNodeData } from "./node/LoraNumberMap";
import ToolboxPanel from "./ToolboxPanel";
import { useGraphStore } from "./Store";
import { useSettingsStore } from "../../singleton/settings/Store";

// TODO: construct this type from `typeof nodeTypes`

type NodesData = {
  "automatic-1111": Automatic1111NodeData;
  model: ModelNodeData;
  number: NumberNodeData;
  string: StringNodeData;
  "image-output": ImageOutputNodeData;
  "text-output": TextOutputNodeData;
  "number-pair": NumberPairNodeData;
  "string-number-map": StringNumberMapNodeData;
  "lora-number-map": LoraNumberMapNodeData;
};

const Graph: FC<{
  className: string;
}> = ({ className }) => {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange, nodeTypes } =
    useGraphStore((state) => state);

  const { panSensitivity, zoomSensitivity } = useSettingsStore((state) => ({
    panSensitivity: state.panSensitivity,
    zoomSensitivity: state.zoomSensitivity,
  }));

  return (
    <div className={twMerge(className, "")}>
      <ReactFlow
        edges={edges}
        nodes={nodes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        attributionPosition="bottom-left"
        nodeTypes={nodeTypes}
        panOnScroll
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        panOnDrag={false}
        panOnScrollSpeed={panSensitivity}
      >
        <ToolboxPanel />
        <Background className="bg-neutral-900" gap={30} />
      </ReactFlow>
    </div>
  );
};

export default Graph;
