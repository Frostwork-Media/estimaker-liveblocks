import { getVariables } from "./helpers";
import { StaticNodeData } from "shared";
import toposort from "toposort";
import { LiveNode } from "./useLive";

export function getSquiggleCode(
  nodesArray: [string, LiveNode][] | [string, StaticNodeData][] | undefined,
  nodeId: string
) {
  if (!nodesArray?.length) return "";
  // check if nodes is map
  const idsToCheck = [nodeId];
  const deps: [string, string][] = [];
  const nodeIds: string[] = [];

  /**
   * Keep a map from node id's to their varName and value
   * This is used to rebuild the code after a topological sort
   */
  const idToVarNameAndValue: Record<string, [string, string]> = {};

  while (idsToCheck.length) {
    const id = idsToCheck.pop();
    if (!id) continue;
    const nodeArr = nodesArray.find(([nodeId]) => nodeId === id);
    if (!nodeArr) continue;
    // Don't check nodes twice
    if (id in nodeIds) continue;
    nodeIds.push(id);

    const node = nodeArr[1];
    const value = node.value ?? "";
    idToVarNameAndValue[id] = [node.variableName, value];

    const variablesInValue = getVariables(value);
    for (const variableName of variablesInValue) {
      // find the node with this variable name
      const foundNode = nodesArray.find(([_id, node]) => {
        return node.variableName === variableName;
      });
      if (!foundNode) continue;
      const [sourceNodeId] = foundNode;
      deps.push([sourceNodeId, id]);
      idsToCheck.push(sourceNodeId);
    }
  }

  const sortedIds = toposort.array(Array.from(new Set(nodeIds)), deps);

  const code =
    sortedIds
      .map((id) => {
        const [variableName, value] = idToVarNameAndValue[id];
        return `${variableName} = ${value}`;
      })
      .join("\n") + `\n${idToVarNameAndValue[nodeId][0]}`;

  return code;
}
