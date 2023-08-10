import type { Node, Edge } from "reactflow";
import { LiveNode } from "./useLive";

export type AppNodeData = {
  label: string;
  selfValue: string;
} & LiveNode;

export type AppNode = Node<AppNodeData>;

export type AppEdgeData = Record<string, never>;

export type AppEdge = Edge<AppEdgeData>;
