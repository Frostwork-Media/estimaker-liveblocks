import { AppNode } from "./types";
import { CUSTOM_NODE } from "./constants";
import { LiveMarketNode, LiveNode } from "@/lib/useLive";
import { StaticNodeData } from "shared";

/**
 * Converts LiveNodes and selectedIds to ReactFlow nodes
 */
export function createNodes(
  nodesArray: [string, LiveNode][] | [string, StaticNodeData][],
  marketNodes: [string, LiveMarketNode][],
  selectedIds: string[]
): AppNode[] {
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
