import { AppNode } from "./types";
import { CUSTOM_NODE } from "./constants";
import { LiveNodes } from "@/lib/useLive";

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
