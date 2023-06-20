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
import Automatic1111Node, { Automatic1111NodeData } from "./node/Automatic1111";
import ImageOutputNode, { ImageOutputNodeData } from "./node/ImageOutput";
import StringOutputNode, { StringOutputNodeData } from "./node/StringOutput";
import NumberPairNode, { NumberPairNodeData } from "./node/NumberPair";
import StringNumberMapNode, {
  StringNumberMapNodeData,
} from "./node/StringNumberMap";
import LoraNumberMapNode, { LoraNumberMapNodeData } from "./node/LoraNumberMap";
import ModelNode, { ModelNodeData } from "./node/Model";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import superjson from "superjson";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "../../singleton/Notification/Store";
import { NodeData } from "./node/Base";
import NumberNode, { NumberNodeData } from "./node/Number";
import StringNode, { StringNodeData } from "./node/String";

const nodeTypes = {
  "automatic-1111": Automatic1111Node,
  model: ModelNode,
  number: NumberNode,
  string: StringNode,
  "image-output": ImageOutputNode,
  "text-output": StringOutputNode,
  "number-pair": NumberPairNode,
  "string-number-map": StringNumberMapNode,
  "lora-number-map": LoraNumberMapNode,
} as const;

type NodeDataMap = {
  "automatic-1111": Automatic1111NodeData;
  model: ModelNodeData;
  number: NumberNodeData;
  string: StringNodeData;
  "image-output": ImageOutputNodeData;
  "text-output": StringOutputNodeData;
  "number-pair": NumberPairNodeData;
  "string-number-map": StringNumberMapNodeData;
  "lora-number-map": LoraNumberMapNodeData;
};

export const useGraphStore = create<{
  nodeTypes: NodeTypes;
  nodes: Node[];
  nodeIndex: Map<string, Node>;
  getNode: (id: string) => Node | undefined;
  edges: Edge[];
  edgeIndex: Map<string, Edge>;
  getEdge: (id: string) => Edge | undefined;
  createNode: <T extends keyof typeof nodeTypes>(
    nodeType: T,
    data: NodeDataMap[T],
    position?: { x: number; y: number }
  ) => boolean;
  setNodeData: <T extends NodeData>(id: string, data: T) => boolean;
  getNodeData: <T extends NodeData>(id: string) => T | undefined;
  onConnect: (connection: Connection) => boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
}>()(
  persist(
    (set, get) => ({
      nodeTypes: nodeTypes,
      nodes: [],
      edges: [],
      nodeIndex: new Map(),
      edgeIndex: new Map(),
      onNodesChange: (changes: NodeChange[]) => {
        console.debug("Triggering onNodesChange", changes);
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        console.debug("Triggering onEdgesChange", changes);
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      getNode: (id) => get().nodeIndex.get(id),
      getEdge: (id) => get().edgeIndex.get(id),
      // Node data should only be updated by the nodes themselves
      setNodeData: (id, data) => {
        const node = get().getNode(id);
        if (!node) {
          console.error(`Fail to find node ${id}`);
          return false;
        }
        node.data = data;
        set((state) => ({
          ...state,
          nodes: [...state.nodes],
        }));
        return true;
      },
      getNodeData: <T extends NodeData>(id: string) =>
        get().getNode(id)?.data as T | undefined,
      /**
       * Return True if the connection was added successfully, else return False
       *
       * Note that the connection validation check can actually be performed by
       * the source handle, however, it would make more sense to put this validation
       * check in the store because the validation checks might involve nodes/edges
       * that are not part of the connection
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

        // // TODO: optimize the performance by appending the node type data to the connection
        // const findNodeTypeById = (id: string) =>
        //   get().nodes.find((n) => n.id === id)?.type;

        // // Just to stop TS from complaining that we might be indexing with
        // // a non-existent key or an `undefined` key
        // const sourceNodeType = findNodeTypeById(
        //   connection.source
        // ) as keyof typeof nodeTypeConfigs;
        // const targetNodeType = findNodeTypeById(
        //   connection.target
        // ) as keyof typeof nodeTypeConfigs;

        // const sourceEndpoint = nodeTypeConfigs[sourceNodeType]?.outputs?.find(
        //   (o) => o.id === connection.sourceHandle
        // );

        // const targetEndpoint = nodeTypeConfigs[targetNodeType]?.inputs?.find(
        //   (i) => i.id === connection.targetHandle
        // );

        // if (
        //   !(
        //     sourceEndpoint &&
        //     targetEndpoint &&
        //     sourceEndpoint.isConnectableTo(targetEndpoint) &&
        //     targetEndpoint.isConnectableTo(sourceEndpoint)
        //   )
        // ) {
        //   useNotificationStore
        //     .getState()
        //     .showNotification(
        //       "Error",
        //       `Fail to connect ${sourceNodeType}'s ${connection.sourceHandle} to ${targetEndpoint}'s ${connection.targetHandle}`
        //     );
        //   return false;
        // }

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
        const id = uuidv4();
        const newNode = {
          id,
          type: nodeType,
          data,
          position,
        };
        set((state) => ({
          ...state,
          nodes: [...get().nodes, newNode],
        }));
        get().nodeIndex.set(id, newNode);
        return true;
      },
    }),
    {
      name: "graph-storage",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        nodeIndex: state.nodeIndex,
        edgeIndex: state.edgeIndex,
      }),

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
        const nodeSchema = z.object({
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
        });
        const edgeSchema = z.object({
          id: z.string(),
          source: z.string(),
          target: z.string(),
          sourceHandle: z.string(),
          targetHandle: z.string(),
          type: z.string(),
          animated: z.boolean(),
          label: z.string().optional(),
        });
        const nodeIndexSchema = z.map(z.string(), nodeSchema);
        const edgeIndexSchema = z.map(z.string(), edgeSchema);
        const schema = z.object({
          nodes: z.array(nodeSchema),
          edges: z.array(edgeSchema),
          nodeIndex: nodeIndexSchema,
          edgeIndex: edgeIndexSchema,
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
          nodeIndex: new Map([
            ...current.nodeIndex,
            ...parseResult.data.nodeIndex,
          ]),
          edgeIndex: new Map([
            ...current.edgeIndex,
            ...parseResult.data.edgeIndex,
          ]),
        };
      },
      // TODO: hash it to prevent tempering
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
              nodeIndex: deserializedValue?.state?.nodeIndex,
              edgeIndex: deserializedValue?.state?.edgeIndex,
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
