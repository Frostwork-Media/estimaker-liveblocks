import { useMemo } from "react";
import { AppEdge } from "./types";
import { getVariables } from "./helpers";
import { LiveNodes, LiveSuggestedEdges } from "./useLive";
import { CUSTOM_EDGE } from "./constants";
import { SimplifiedStorage } from "shared";

/**
 * Converts the live nodes and suggested edges into a list of react flow edges
 */
export function useEdgesLive(
  liveNodes: LiveNodes,
  liveSuggestedEdges: LiveSuggestedEdges
) {
  return useMemo<AppEdge[]>(() => {
    const nodesArray = Array.from(liveNodes.entries() ?? []);
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
    const suggestedEdgesArray = Array.from(liveSuggestedEdges.entries());
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
  }, [liveNodes, liveSuggestedEdges]);
}

/**
 * Creates react flow edges from static nodes and suggested edges
 */
export function useEdgesStatic(
  nodes: SimplifiedStorage["nodes"],
  suggestedEdges: {
    [key: string]: string[];
  }
): AppEdge[] {
  return useMemo<AppEdge[]>(() => {
    const nodesArray = Object.entries(nodes);
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
    const suggestedEdgesArray = Object.entries(suggestedEdges);
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
  }, [nodes, suggestedEdges]);
}
