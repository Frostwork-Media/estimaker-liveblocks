import { LiveNodes } from "@/lib/useLive";
import { getVariables } from "./helpers";
import { SimplifiedStorage } from "shared";
import toposort from "toposort";

/** Returns all the squiggle code needed to run for a given node */
export function getSquiggleCode(nodes: LiveNodes | undefined, nodeId: string) {
  if (!nodes) return "";
  // check if nodes is map
  const nodesArray = Array.from(nodes.entries());
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
    const node = nodes.get(id);
    if (!node) continue;
    // Don't check nodes twice
    if (id in nodeIds) continue;
    nodeIds.push(id);

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
} /** Returns all the squiggle code needed to run for a given node */
export function getSquiggleCodeImmutable(
  nodes: SimplifiedStorage["nodes"],
  nodeId: string
) {
  if (!nodes) return "";
  // check if nodes is map
  const nodesArray = Object.entries(nodes);
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
    const node = nodes[id];
    if (!node) continue;
    // Don't check nodes twice
    if (id in nodeIds) continue;
    nodeIds.push(id);

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
