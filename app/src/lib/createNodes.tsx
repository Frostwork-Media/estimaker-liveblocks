import { SQUIGGLE_NODE } from "./constants";
import { Schema } from "shared";
import { Node } from "reactflow";

/**
 * Converts LiveNodes and selectedIds to ReactFlow nodes
 */
export function createNodes({
  squiggle,
  selected,
}: {
  squiggle: Schema["squiggle"];
  selected: string[];
}): Node<any>[] {
  const nodes: Node<any>[] = [];

  for (const [id, node] of Object.entries(squiggle)) {
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
      selected: selected.includes(id),
    });
  }

  // for (const [id, node] of Object.entries(manifold)) {
  //   nodes.push({
  //     id,
  //     data: {
  //       ...node,
  //     },
  //     position: { x: node.x, y: node.y },
  //     type: MANIFOLD_NODE,
  //     selected: selected.includes(id),
  //   });
  // }

  return nodes;
}
