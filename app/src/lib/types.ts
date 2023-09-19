import type { Edge } from "reactflow";

export type NodeData<T> = {
  label: string;
} & T;

export type AppEdgeData = Record<string, never>;

export type AppEdge = Edge<AppEdgeData>;
