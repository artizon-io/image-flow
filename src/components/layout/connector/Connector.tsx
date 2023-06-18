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
  ) => boolean;
  onConnect: (connection: Connection) => boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
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
      /**
       * Return True if the connection was added successfully, else return False
       */
      onConnect: (connection: Connection) => {
        console.debug("onConnect", connection);

        if (
          !connection.source ||
          !connection.target ||
          !connection.sourceHandle ||
          !connection.targetHandle
        ) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Fail to connect ${connection.sourceHandle} to ${connection.targetHandle}`
            );
          return false;
        }
        set((state) => ({
          ...state,
          edges: addEdge(
            {
              id: uuidv4(),
              source: connection.source,
              target: connection.target,
              sourceHandle: connection.sourceHandle,
              targetHandle: connection.targetHandle,
              animated: true,
              type: "default",
            },
            get().edges
          ),
        }));
        return true;
      },
      /**
       * Return True if the node was added successfully, else return False
       */
      createNode: (nodeType, data, position = { x: 0, y: 0 }) => {
        const newNode = {
          id: uuidv4(),
          type: nodeType,
          data,
          position,
        };
        set((state) => ({
          ...state,
          nodes: [...get().nodes, newNode],
        }));
        return true;
      },
    }),
    {
      name: "connector-storage",
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),

      // TODO: save connector state in a more performant storage
      // TODO: reduce the frequency of writing connector state to storage (particular on node drag)

      // Note: the persisted state is already partialized
      merge: (persisted, current) => {
        console.debug(
          "Merging Connector state from local storage",
          persisted,
          current
        );

        // TODO: move the schemas somewhere else
        const nodesSchema = z.array(
          z.object({
            id: z.string(),
            position: z
              .object({
                x: z.number(),
                y: z.number(),
              })
              .required(),
            type: z.string().optional(),
            // TODO: improve the schema (store the node data scheme in each node respectively)
            // Passing through arbitrary node data for now
            data: z.object({}).passthrough(),
          })
        );
        const edgesSchema = z.array(
          z.object({
            id: z.string(),
            source: z.string(),
            target: z.string(),
            type: z.string(),
            animated: z.boolean(),
            label: z.string().optional(),
          })
        );
        const schema = z.object({
          nodes: nodesSchema,
          edges: edgesSchema,
        });

        const parseResult = schema.safeParse(persisted);

        if (!parseResult.success) {
          console.error(
            "Fail to parse Connector state from local storage",
            parseResult.error.issues
          );
          useNotificationStore
            .getState()
            .showNotification(
              "Warning",
              "Fail to load Connector state from local storage"
            );
          return current;
        }

        // const { nodes: newNodes, edges: newEdges } = persisted as z.infer<
        //   typeof schema
        // >;

        return {
          ...current,
          nodes: [...current.nodes, ...parseResult.data.nodes],
          edges: [...current.edges, ...parseResult.data.edges],
        };
      },
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (!value) return null;
          const deserializedValue: any = superjson.parse(value);

          console.debug(
            "Retrieving connector state from local storage",
            deserializedValue
          );

          return {
            state: {
              nodes: deserializedValue?.state?.nodes,
              edges: deserializedValue?.state?.edges,
            },
            version: deserializedValue?.version,
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
