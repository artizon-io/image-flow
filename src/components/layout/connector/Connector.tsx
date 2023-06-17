import { FC } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeTypes,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { twMerge } from "tailwind-merge";
import "reactflow/dist/style.css";
import "./react-flow.css";
import ModelNode from "./node/Model";
import ToolboxPanel from "./ToolboxPanel";
import StringNode from "./node/String";
import ImageOutputNode from "./node/ImageOutput";
import NumberPairNode from "./node/NumberPair";
import NumberNode from "./node/Number";
import Automatic1111Node from "./node/Automatic1111";
import TextOutputNode from "./node/TextOutput";
import StringNumberMapNode from "./node/StringNumberMap";
import LoraNumberMap from "./node/LoraNumberMap";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import superjson from "superjson";
import { v4 as uuidv4 } from "uuid";
import type { NodeData as ModelNodeData } from "./node/Model";
import type { NodeData as Automatic1111NodeData } from "./node/Automatic1111";
import type { NodeData as NumberNodeData } from "./node/Number";
import type { NodeData as StringNodeData } from "./node/String";
import type { NodeData as ImageOutputNodeData } from "./node/ImageOutput";
import type { NodeData as TextOutputNodeData } from "./node/TextOutput";
import type { NodeData as NumberPairNodeData } from "./node/NumberPair";
import type { NodeData as StringNumberMapNodeData } from "./node/StringNumberMap";
import type { NodeData as LoraNumberMapNodeData } from "./node/LoraNumberMap";
import { useNotificationStore } from "../../Notification";

// TODO: for each node, show input dialog instead of fixing the value

const customNodes = {
  "automatic-1111": Automatic1111Node,
  model: ModelNode,
  number: NumberNode,
  string: StringNode,
  "image-output": ImageOutputNode,
  "text-output": TextOutputNode,
  "number-pair": NumberPairNode,
  "string-number-map": StringNumberMapNode,
  "lora-number-map": LoraNumberMap,
};

const nodeTypes = {
  "automatic-1111": Automatic1111Node,
  model: ModelNode,
  number: NumberNode,
  string: StringNode,
  "image-output": ImageOutputNode,
  "text-output": TextOutputNode,
  "number-pair": NumberPairNode,
  "string-number-map": StringNumberMapNode,
  "lora-number-map": LoraNumberMap,
} as const;

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

export const useConnectorStore = create<{
  nodeTypes: NodeTypes;
  nodes: Node[];
  edges: Edge[];
  createNode: <T extends keyof typeof customNodes>(
    nodeType: T,
    data: NodesData[T],
    position?: { x: number; y: number }
  ) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}>()(
  persist(
    (set, get) => ({
      nodeTypes: nodeTypes,
      nodes: [],
      edges: [],
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      createNode: (nodeType, data, position = { x: 0, y: 0 }) => {
        const newNode = {
          id: uuidv4(),
          type: nodeType,
          data,
          position,
        };
        set({
          nodes: [...get().nodes, newNode],
        });
      },
    }),
    {
      name: "connector-storage",
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      // TODO: fix persisting connector state not working
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (!value) return null;
          const deserializedValue = superjson.parse(value);

          const parseResult = z
            .object({
              nodes: z.array(
                z.object({
                  id: z.string(),
                  position: z
                    .object({
                      x: z.number(),
                      y: z.number(),
                    })
                    .required(),
                  type: z.string().optional(),
                  data: z.object({}),
                })
              ),
              edges: z.array(
                z.object({
                  id: z.string(),
                  source: z.string(),
                  target: z.string(),
                  type: z.string(),
                  animated: z.boolean(),
                  label: z.string().optional(),
                })
              ),
            })
            .safeParse(deserializedValue);

          if (!parseResult.success) {
            useNotificationStore
              .getState()
              .showNotification(
                "Warning",
                "Fail to load Connector state from local storage"
              );
            return null;
          }

          return {
            state: {
              nodes: parseResult.data.nodes,
              edges: parseResult.data.edges,
            },
          };
        },
        setItem: (name, value) => {
          const serializedValue = superjson.stringify(value);
          console.debug(
            "Saving Connector state to local storage",
            serializedValue
          );
          localStorage.setItem(name, serializedValue);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

const Connector: FC<{
  className: string;
}> = ({ className }) => {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange, nodeTypes } =
    useConnectorStore((state) => state);

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
      >
        <ToolboxPanel />
        <Background className="bg-neutral-900" gap={30} />
      </ReactFlow>
    </div>
  );
};

export default Connector;
