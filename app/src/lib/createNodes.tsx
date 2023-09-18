import { SQUIGGLE_NODE, MANIFOLD_NODE } from "./constants";
import { AnyNode, ManifoldNode } from "shared";

/**
 * Converts LiveNodes and selectedIds to ReactFlow nodes
 */
export function createNodes({
  squiggle,
  manifold,
  selectedIds,
}: {
  squiggle: [string, AnyNode][];
  manifold: Record<string, ManifoldNode>;
  selectedIds: string[];
}): any[] {
  const nodes: any[] = [];

  for (const [id, node] of squiggle) {
    if (node.nodeType !== "squiggle") continue;
    nodes.push({
      id,
      data: {
        label: node.content,
        selfValue: node.value,
        ...node,
      },
      position: { x: node.x, y: node.y },
      type: SQUIGGLE_NODE,
      selected: selectedIds.includes(id),
    });
  }

  for (const [id, node] of Object.entries(manifold)) {
    nodes.push({
      id,
      data: {
        ...node,
      },
      position: { x: node.x, y: node.y },
      type: MANIFOLD_NODE,
      selected: selectedIds.includes(id),
    });
  }

  return nodes;
}
