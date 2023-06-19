import {
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeTypes,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import "./react-flow.css";
import Automatic1111Node, {
  config as automatic1111NodeConfig,
} from "./node/Automatic1111";
import StringNode, { config as stringNodeConfig } from "./node/String";
import NumberNode, { config as numberNodeConfig } from "./node/Number";
import ImageOutputNode, {
  config as imageOutputNodeConfig,
} from "./node/ImageOutput";
import TextOutputNode, {
  config as textOutputNodeConfig,
} from "./node/StringOutput";
import NumberPairNode, {
  config as numberPairNodeConfig,
} from "./node/NumberPair";
import StringNumberMapNode, {
  config as stringNumberMapNodeConfig,
} from "./node/StringNumberMap";
import LoraNumberMapNode, {
  config as loraNumberMapNodeConfig,
} from "./node/LoraNumberMap";
import ModelNode, { config as modelNodeConfig } from "./node/Model";
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
import type { NodeData as TextOutputNodeData } from "./node/StringOutput";
import type { NodeData as NumberPairNodeData } from "./node/NumberPair";
import type { NodeData as StringNumberMapNodeData } from "./node/StringNumberMap";
import type { NodeData as LoraNumberMapNodeData } from "./node/LoraNumberMap";
import { useNotificationStore } from "../../singleton/Notification/Store";

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

const nodeTypes = {
  "automatic-1111": Automatic1111Node,
  model: ModelNode,
  number: NumberNode,
  string: StringNode,
  "image-output": ImageOutputNode,
  "text-output": TextOutputNode,
  "number-pair": NumberPairNode,
  "string-number-map": StringNumberMapNode,
  "lora-number-map": LoraNumberMapNode,
} as const;

const nodeTypeConfigs = {
  "automatic-1111": automatic1111NodeConfig,
  model: modelNodeConfig,
  number: numberNodeConfig,
  string: stringNodeConfig,
  "image-output": imageOutputNodeConfig,
  "text-output": textOutputNodeConfig,
  "number-pair": numberPairNodeConfig,
  "string-number-map": stringNumberMapNodeConfig,
  "lora-number-map": loraNumberMapNodeConfig,
} as const;

export const useGraphStore = create<{
  nodeTypes: NodeTypes;
  nodes: Node[];
  edges: Edge[];
  createNode: <T extends keyof typeof nodeTypes>(
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
        if (
          !connection.source ||
          !connection.target ||
          !connection.sourceHandle ||
          !connection.targetHandle
        ) {
          useNotificationStore
            .getState()
            .showNotification("Error", `Fail to connect nodes`);
          return false;
        }

        // TODO: optimize the performance by appending the node type data to the connection
        const findNodeTypeById = (id: string) =>
          get().nodes.find((n) => n.id === id)?.type;

        // Just to stop TS from complaining that we might be indexing with
        // a non-existent key or an `undefined` key
        const sourceNodeType = findNodeTypeById(
          connection.source
        ) as keyof typeof nodeTypeConfigs;
        const targetNodeType = findNodeTypeById(
          connection.target
        ) as keyof typeof nodeTypeConfigs;

        const sourceEndpoint = nodeTypeConfigs[sourceNodeType]?.outputs?.find(
          (o) => o.id === connection.sourceHandle
        );

        const targetEndpoint = nodeTypeConfigs[targetNodeType]?.inputs?.find(
          (i) => i.id === connection.targetHandle
        );

        if (
          !(
            sourceEndpoint &&
            targetEndpoint &&
            sourceEndpoint.isConnectableTo(targetEndpoint) &&
            targetEndpoint.isConnectableTo(sourceEndpoint)
          )
        ) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Fail to connect ${sourceNodeType}'s ${connection.sourceHandle} to ${targetEndpoint}'s ${connection.targetHandle}`
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
        // TODO: spawn the node in better position
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
      name: "graph-storage",
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),

      // TODO: save graph state in a more performant storage
      // TODO: reduce the frequency of writing graph state to storage (particular on node drag)

      // Note: the persisted state is already partialized
      merge: (persisted, current) => {
        if (!persisted) return current;

        console.debug(
          "Merging Graph state from local storage",
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
            sourceHandle: z.string(),
            targetHandle: z.string(),
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
            "Fail to parse Graph state from local storage",
            parseResult.error.issues
          );
          useNotificationStore
            .getState()
            .showNotification(
              "Warning",
              "Fail to load Graph state from local storage"
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
            "Retrieving Graph state from local storage",
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
          console.debug("Saving Graph state to local storage", serializedValue);
          localStorage.setItem(name, serializedValue);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
