import type { Node, Edge } from "reactflow";
import { SquiggleNode } from "shared";

export type AppNodeData = {
  label: string;
  selfValue: string;
} & SquiggleNode;

export type AppNode = Node<AppNodeData>;

export type AppEdgeData = Record<string, never>;

export type AppEdge = Edge<AppEdgeData>;
