import { SQUIGGLE_NODE } from "./constants";
import { Schema } from "shared";
import { Node } from "reactflow";

/**
 * Converts LiveNodes and selectedIds to ReactFlow nodes
 */
export function createNodes({
  squiggle,
  metaforecast,
  selected,
}: {
  squiggle: Schema["squiggle"];
  metaforecast: Schema["metaforecast"];
  selected: string[];
}): Node<any>[] {
  const nodes: Node<any>[] = [];

  for (const [id, node] of Object.entries(squiggle)) {
    if (node.nodeType !== "squiggle") continue;
    nodes.push({
      id,
      data: {
        label: node.content,
        ...node,
      },
      position: { x: node.x, y: node.y },
      type: SQUIGGLE_NODE,
      selected: selected.includes(id),
    });
  }

  for (const [id, node] of Object.entries(metaforecast)) {
    if (node.nodeType !== "metaforecast") continue;
    const { x, y, ...rest } = node;
    nodes.push({
      id,
      data: rest,
      position: { x, y },
      type: "metaforecast",
      selected: selected.includes(id),
    });
  }

  return nodes;
}
