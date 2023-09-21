import { useMemo } from "react";
import toposort from "toposort";
import { getVariables } from "./helpers";
import { useSquiggleNodes } from "./useSquiggleNodes";

/**
 * Compiles all squiggle nodes into a single string of code
 */

export function useProjectCode() {
  const liveNodes = useSquiggleNodes();
  const nodesArray = Object.entries(liveNodes);
  const squiggleCode = useMemo(() => {
    try {
      const deps: [string, string][] = [];
      const nodeIds: string[] = [];
      // loop over nodes
      for (const [id, node] of nodesArray) {
        // if it doesn't have a value skip it
        if (!node.value) continue;

        // add it to our array of ids
        nodeIds.push(id);

        // get the variables in the value
        const variablesInValue = getVariables(node.value);

        // for each variable in the value
        for (const variableName of variablesInValue) {
          // check if there is a node with that variable name
          const foundNode = nodesArray.find(([_id, node]) => {
            return node.variableName === variableName;
          });

          // if there is then add it to the deps
          if (foundNode) {
            const [sourceNodeId] = foundNode;
            deps.push([sourceNodeId, id]);
          }
        }
      }

      // toposort all the nodes, even ones with no deps
      const sortedIds = toposort.array(Array.from(new Set(nodeIds)), deps);

      // map over sorted ids and create the code line by line
      const code = sortedIds
        .map((id) => {
          const found = nodesArray.find(([nodeId]) => nodeId === id) ?? [];
          if (!found) return "";
          const [, node] = found;
          if (!node) return "";
          return `${node.variableName} = ${node.value}`;
        })
        .join("\n");

      return code;
    } catch (error) {
      console.error(error);
      return "";
    }
  }, [nodesArray]);
  return squiggleCode;
}
