import { FC } from "react";
import ReactFlow, { Background, SelectionMode } from "reactflow";
import { twMerge } from "tailwind-merge";
import "reactflow/dist/style.css";
import "./react-flow.css";
import ToolboxPanel from "./ToolboxPanel";
import { useGraphStore } from "./Store";
import { useSettingsStore } from "../../singleton/settings/Store";

// TODO: ditch ReactFlow and use rustwasm web-sys instead (which uses Web Canvas API)

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
        onlyRenderVisibleElements
        fitView
      >
        <ToolboxPanel />
        <Background className="bg-neutral-900" gap={30} />
      </ReactFlow>
    </div>
  );
};

export default Graph;
