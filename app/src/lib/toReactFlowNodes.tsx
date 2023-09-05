import { AppNode } from "./types";
import { CUSTOM_NODE } from "./constants";
import { LiveNodes } from "@/lib/useLive";
import { PublicProject } from "shared";

/**
 * Converts LiveNodes and selectedIds to ReactFlow nodes
 */
export function toReactFlowNodes(
  liveNodes: LiveNodes,
  selectedIds: string[]
): AppNode[] {
  const nodesArray = Array.from(liveNodes.entries());
  const nodes: AppNode[] = [];

  for (const [id, node] of nodesArray) {
    nodes.push({
      id,
      data: {
        label: node.content,
        selfValue: node.value,
        ...node,
      },
      position: { x: node.x, y: node.y },
      type: CUSTOM_NODE,
      selected: selectedIds.includes(id),
    });
  }

  return nodes;
}

/**
 * Converts static nodes to ReactFlow nodes
 */
export function fromPublicToReactFlowNodes(
  nodes: PublicProject["storage"]["data"]["nodes"]["data"]
): AppNode[] {
  const nodesArray = Array.from(Object.entries(nodes));
  const reactFlowNodes: AppNode[] = [];

  for (const [id, { data: node }] of nodesArray) {
    reactFlowNodes.push({
      id,
      data: {
        label: node.content,
        selfValue: node.value,
        ...node,
      },
      position: { x: node.x, y: node.y },
      type: CUSTOM_NODE,
      selected: false,
    });
  }

  return reactFlowNodes;
}
