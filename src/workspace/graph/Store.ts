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
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import superjson from "superjson";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "../../singleton/Notification/Store";
import { BaseNodeData } from "./node/Base";
import { produce } from "immer";

import Automatic1111Node, {
  Automatic1111NodeData,
  automatic1111NodeDataSchema,
  createAutomatic1111NodeData,
} from "./node/Automatic1111";
import NumberNode, {
  NumberNodeData,
  createNumberNodeData,
  numberNodeDataSchema,
} from "./node/Number";
import StringNode, {
  StringNodeData,
  createStringNodeData,
  stringNodeDataSchema,
} from "./node/String";
import ImageOutputNode, {
  ImageOutputNodeData,
  createImageOutputNodeData,
  imageOutputNodeDataSchema,
} from "./node/ImageOutput";
import StringOutputNode, {
  StringOutputNodeData,
  createStringOutputNodeData,
  stringOutputNodeDataSchema,
} from "./node/StringOutput";
import ModelNode, {
  ModelNodeData,
  createModelNodeData,
  modelNodeDataSchema,
} from "./node/Model";
import NumberPairNode, {
  NumberPairNodeData,
  createNumberPairNodeData,
  numberPairNodeDataSchema,
} from "./node/NumberPair";
import StringNumberMapNode, {
  StringNumberMapNodeData,
  createStringNumberMapNodeData,
  stringNumberMapNodeDataSchema,
} from "./node/StringNumberMap";
import LoraNumberMapNode, {
  LoraNumberMapNodeData,
  createLoraNumberMapNodeData,
  loraNumberMapNodeDataSchema,
} from "./node/LoraNumberMap";
import { Endpoint, InputEndpoint, OutputEndpoint } from "./node/endpoint";
import AddStringNode, {
  AddStringNodeData,
  addStringNodeDataSchema,
  createAddStringNodeData,
} from "./node/add/string";
import AddNumberNode, {
  AddNumberNodeData,
  addNumberNodeDataSchema,
  createAddNumberNodeData,
} from "./node/add/number";
import AddNumberPairNode, {
  AddNumberPairNodeData,
  addNumberPairNodeDataSchema,
  createAddNumberPairNodeData,
} from "./node/add/numberPair";
import AddStringNumberMapNode, {
  AddStringNumberMapNodeData,
  addStringNumberMapNodeDataSchema,
  createAddStringNumberMapNodeData,
} from "./node/add/stringNumberMap";
import AddLoraNumberMapNode, {
  AddLoraNumberMapNodeData,
  addLoraNumberMapNodeDataSchema,
  createAddLoraNumberMapNodeData,
} from "./node/add/loraNumberMap";
import SubtractStringNode, {
  SubtractStringNodeData,
  createSubtractStringNodeData,
  subtractStringNodeDataSchema,
} from "./node/subtract/string";
import SubtractNumberNode, {
  SubtractNumberNodeData,
  createSubtractNumberNodeData,
  subtractNumberNodeDataSchema,
} from "./node/subtract/number";
import SubtractNumberPairNode, {
  SubtractNumberPairNodeData,
  createSubtractNumberPairNodeData,
  subtractNumberPairNodeDataSchema,
} from "./node/subtract/numberPair";
import SubtractStringNumberMapNode, {
  SubtractStringNumberMapNodeData,
  createSubtractStringNumberMapNodeData,
  subtractStringNumberMapNodeDataSchema,
} from "./node/subtract/stringNumberMap";
import SubtractLoraNumberMapNode, {
  SubtractLoraNumberMapNodeData,
  createSubtractLoraNumberMapNodeData,
  subtractLoraNumberMapNodeDataSchema,
} from "./node/subtract/loraNumberMap";
import SamplerNode, {
  SamplerNodeData,
  createSamplerNodeData,
  samplerNodeDataSchema,
} from "./node/Sampler";

const nodeTypes = {
  "automatic-1111": Automatic1111Node,
  number: NumberNode,
  string: StringNode,
  "image-output": ImageOutputNode,
  "string-output": StringOutputNode,
  model: ModelNode,
  sampler: SamplerNode,
  "number-pair": NumberPairNode,
  "string-number-map": StringNumberMapNode,
  "lora-number-map": LoraNumberMapNode,
  "add-string": AddStringNode,
  "add-number": AddNumberNode,
  "add-number-pair": AddNumberPairNode,
  "add-string-number-map": AddStringNumberMapNode,
  "add-lora-number-map": AddLoraNumberMapNode,
  "subtract-string": SubtractStringNode,
  "subtract-number": SubtractNumberNode,
  "subtract-number-pair": SubtractNumberPairNode,
  "subtract-string-number-map": SubtractStringNumberMapNode,
  "subtract-lora-number-map": SubtractLoraNumberMapNode,
} as const;

const nodeDataSchemas = {
  "automatic-1111": automatic1111NodeDataSchema,
  number: numberNodeDataSchema,
  string: stringNodeDataSchema,
  "image-output": imageOutputNodeDataSchema,
  "string-output": stringOutputNodeDataSchema,
  model: modelNodeDataSchema,
  sampler: samplerNodeDataSchema,
  "number-pair": numberPairNodeDataSchema,
  "string-number-map": stringNumberMapNodeDataSchema,
  "lora-number-map": loraNumberMapNodeDataSchema,
  "add-string": addStringNodeDataSchema,
  "add-number": addNumberNodeDataSchema,
  "add-number-pair": addNumberPairNodeDataSchema,
  "add-string-number-map": addStringNumberMapNodeDataSchema,
  "add-lora-number-map": addLoraNumberMapNodeDataSchema,
  "subtract-string": subtractStringNodeDataSchema,
  "subtract-number": subtractNumberNodeDataSchema,
  "subtract-number-pair": subtractNumberPairNodeDataSchema,
  "subtract-string-number-map": subtractStringNumberMapNodeDataSchema,
  "subtract-lora-number-map": subtractLoraNumberMapNodeDataSchema,
} as const;

const nodeCreateDataFunctions = {
  "automatic-1111": createAutomatic1111NodeData,
  number: createNumberNodeData,
  string: createStringNodeData,
  "image-output": createImageOutputNodeData,
  "string-output": createStringOutputNodeData,
  model: createModelNodeData,
  sampler: createSamplerNodeData,
  "number-pair": createNumberPairNodeData,
  "string-number-map": createStringNumberMapNodeData,
  "lora-number-map": createLoraNumberMapNodeData,
  "add-string": createAddStringNodeData,
  "add-number": createAddNumberNodeData,
  "add-number-pair": createAddNumberPairNodeData,
  "add-string-number-map": createAddStringNumberMapNodeData,
  "add-lora-number-map": createAddLoraNumberMapNodeData,
  "subtract-string": createSubtractStringNodeData,
  "subtract-number": createSubtractNumberNodeData,
  "subtract-number-pair": createSubtractNumberPairNodeData,
  "subtract-string-number-map": createSubtractStringNumberMapNodeData,
  "subtract-lora-number-map": createSubtractLoraNumberMapNodeData,
} as const;

type NodeDataMap = {
  "automatic-1111": Automatic1111NodeData;
  number: NumberNodeData;
  string: StringNodeData;
  "image-output": ImageOutputNodeData;
  "string-output": StringOutputNodeData;
  model: ModelNodeData;
  sampler: SamplerNodeData;
  "number-pair": NumberPairNodeData;
  "string-number-map": StringNumberMapNodeData;
  "lora-number-map": LoraNumberMapNodeData;
  "add-string": AddStringNodeData;
  "add-number": AddNumberNodeData;
  "add-number-pair": AddNumberPairNodeData;
  "add-string-number-map": AddStringNumberMapNodeData;
  "add-lora-number-map": AddLoraNumberMapNodeData;
  "subtract-string": SubtractStringNodeData;
  "subtract-number": SubtractNumberNodeData;
  "subtract-number-pair": SubtractNumberPairNodeData;
  "subtract-string-number-map": SubtractStringNumberMapNodeData;
  "subtract-lora-number-map": SubtractLoraNumberMapNodeData;
};

// TODO: create index for efficient lookup of nodes and edges

export const useGraphStore = create<{
  nodeTypes: NodeTypes;
  nodes: Node[];
  getNode: (id: string) => Node | undefined;
  edges: Edge[];
  getEdge: (id: string) => Edge | undefined;
  getEndpoint: (id: string) => Endpoint | undefined;
  isConnectedToOutputEndpoint: (id: string) => boolean;
  getConnectedInputEndpoints: (id: string) => InputEndpoint[] | undefined;
  getConnectedOutputEndpoints: (id: string) => OutputEndpoint[] | undefined;
  createNode: <T extends keyof typeof nodeTypes>(
    nodeType: T,
    data?: NodeDataMap[T]
  ) => boolean;
  setNodeData: <T extends BaseNodeData>(id: string, data: T) => boolean;
  getNodeData: <T extends BaseNodeData>(id: string) => T | undefined;
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
        console.debug("Triggering onNodesChange", changes);
        changes.forEach((change) => {});
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        console.debug("Triggering onEdgesChange", changes);
        changes.forEach((change) => {});
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      // O(n)
      getNode: (id) => get().nodes.find((node) => node.id === id),
      // O(m)
      getEdge: (id) => get().edges.find((edge) => edge.id === id),
      // O(n * d) where d = average no. endpoints per node
      getEndpoint: (id) =>
        get()
          .nodes.map((n) =>
            [
              (n.data as BaseNodeData).inputs ?? [],
              (n.data as BaseNodeData).outputs ?? [],
            ].flat()
          )
          .flat()
          .find((endpoint) => endpoint.id === id),
      // O(m)
      isConnectedToOutputEndpoint: (id) => {
        for (const edge of get().edges) {
          if (edge.targetHandle === id) return true;
        }

        return false;
      },
      // High performance cost - avoid
      getConnectedInputEndpoints: (id) => {
        const edges = get().edges.filter((edge) => edge.sourceHandle === id);
        if (!edges) return undefined;

        const inputIds = edges.map((e) => e.targetHandle!);
        return inputIds.map((id) => get().getEndpoint(id) as InputEndpoint);
      },
      // High performance cost - avoid
      getConnectedOutputEndpoints: (id) => {
        const edges = get().edges.filter((edge) => edge.targetHandle === id);
        if (!edges) return undefined;

        const inputIds = edges.map((e) => e.sourceHandle!);
        return inputIds.map((id) => get().getEndpoint(id) as OutputEndpoint);
      },
      // O(n)
      setNodeData: (id, data) => {
        const nodes = produce(get().nodes, (draft) => {
          const node = draft.find((n) => n.id === id);
          if (!node) return;

          node.data = data;
        });
        if (!nodes) {
          console.error(`Fail to find node ${id}`);
          return false;
        }
        set({ nodes });
        return true;
      },
      // O(n)
      getNodeData: <T extends BaseNodeData>(id: string) =>
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
          console.error("Connection information is incomplete", connection);
          return false;
        }

        const targetNode = get().getNode(connection.target);
        const sourceNode = get().getNode(connection.source);

        if (!targetNode || !sourceNode) {
          console.error(
            "Fail to find source/target node of connection",
            connection
          );
          return false;
        }

        const targetEndpoint = (targetNode.data as BaseNodeData).inputs?.find(
          (i) => i.id === connection.targetHandle
        );
        const sourceEndpoint = (sourceNode.data as BaseNodeData).outputs?.find(
          (o) => o.id === connection.sourceHandle
        );

        if (!targetEndpoint || !sourceEndpoint) {
          console.error(
            "Fail to find source/target handle of connection",
            connection
          );
          return false;
        }

        if (sourceEndpoint.data.type !== targetEndpoint.type.type) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Fail to connect ${sourceEndpoint.label} to ${targetEndpoint.label} because of type mismatch`
            );
          return false;
        }

        if (
          !(targetNode.data as BaseNodeData).dynamicInputSize &&
          get().isConnectedToOutputEndpoint(targetEndpoint.id)
        ) {
          useNotificationStore
            .getState()
            .showNotification(
              "Error",
              `Fail to connect ${sourceEndpoint.label} to ${targetEndpoint.label} because the target is already connected`
            );
          return false;
        }

        set({
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
        });

        return true;
      },
      /**
       * Return True if the node was added successfully, else return False
       */
      createNode: (nodeType, data) => {
        // TODO: spawn the node in better position
        const id = uuidv4();
        const newNode = {
          id,
          type: nodeType,
          data: data ?? nodeCreateDataFunctions[nodeType](),
          position: { x: 0, y: 0 },
        };
        set({
          nodes: [...get().nodes, newNode],
        });
        return true;
      },
    }),
    {
      name: "graph-storage",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),

      // TODO: save graph state in a more performant storage
      // TODO: reduce the frequency of writing graph state to storage (particular on node drag)
      // TODO: improve safety

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
        const schema = z.object({
          nodes: z.array(nodeSchema),
          edges: z.array(edgeSchema),
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
          // console.debug("Saving Graph state to local storage", serializedValue);
          localStorage.setItem(name, serializedValue);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
