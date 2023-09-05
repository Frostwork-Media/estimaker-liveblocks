import { EdgeTypes, NodeTypes } from "reactflow";
import { EditableCustomNode, FrozenCustomNode } from "../CustomNode/CustomNode";
import EditableCustomEdge, { FrozenCustomEdge } from "../CustomEdge";
import { CUSTOM_NODE, CUSTOM_EDGE } from "@/lib/constants";

export const nodeTypes: NodeTypes = {
  [CUSTOM_NODE]: EditableCustomNode,
};

export const publicNodeTypes: NodeTypes = {
  [CUSTOM_NODE]: FrozenCustomNode,
};

export const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: EditableCustomEdge,
};

export const publicEdgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: FrozenCustomEdge,
};
