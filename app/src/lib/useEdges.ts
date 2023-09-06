import { useMemo } from "react";
import { AppEdge } from "./types";
import { getVariables } from "./helpers";
import { CUSTOM_EDGE } from "./constants";
import { StaticNodeData } from "shared";
import { LiveNode } from "./useLive";

/**
 * Converts the live nodes and suggested edges into a list of react flow edges
 */
export function useEdges(
  nodesArray: [string, LiveNode][] | [string, StaticNodeData][],
  suggestedEdgesArray: [string, string[]][]
) {
  return useMemo<AppEdge[]>(() => {
    // from, to, userId
    const edges: AppEdge[] = [];
    for (const [id, node] of nodesArray) {
      const value = node.value;
      if (!value) continue;
      const variablesInValue = getVariables(value);
      for (const variableName of variablesInValue) {
        // find the node with this variable name
        const foundNode = nodesArray.find(([_id, node]) => {
          return node.variableName === variableName;
        });
        if (!foundNode) continue;
        const [sourceNodeId] = foundNode;
        edges.push({
          id: `${sourceNodeId}-${id}`,
          source: sourceNodeId,
          target: id,
          style: {
            stroke: foundNode[1].color ? `hsl(${foundNode[1].color})` : "#ccc",
            strokeWidth: "2px",
          },
        });
      }
    }

    // Add suggested edges which are not yet in the graph
    for (const [id, [sourceNodeId, targetNodeId]] of suggestedEdgesArray) {
      const foundEdge = edges.find((edge) => {
        return edge.id === id;
      });
      if (foundEdge) continue;
      edges.push({
        id,
        source: sourceNodeId,
        target: targetNodeId,
        style: { stroke: "#ccc", strokeWidth: "2px" },
        animated: true,
        type: CUSTOM_EDGE,
      });
    }

    return edges;
  }, [nodesArray, suggestedEdgesArray]);
}
