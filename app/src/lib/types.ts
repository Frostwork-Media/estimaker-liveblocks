import type { Node, Edge } from "reactflow";

export type AppNodeData = {
  label: string;
  variableName: string;
  selfValue: string;
  showing?: "graph";
};

export type AppNode = Node<AppNodeData>;

export type AppEdgeData = Record<string, never>;

export type AppEdge = Edge<AppEdgeData>;
