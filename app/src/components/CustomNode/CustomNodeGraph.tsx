import { LiveNodes, useLiveNodes } from "@/lib/useLive";
import { getVariables } from "../../lib/helpers";
import { SquiggleChart } from "@quri/squiggle-components";
import toposort from "toposort";
import { Nodes } from "shared";
import { usePublicStoreOrThrow } from "@/lib/usePublicStore";

export function CustomNodeGraph({
  showing,
  nodeId,
}: {
  showing: boolean;
  nodeId: string;
}) {
  if (!showing) return null;
  return <CustomNodeInner nodeId={nodeId} />;
}

function CustomNodeInner({ nodeId }: { nodeId: string }) {
  const nodes = useLiveNodes();
  const code = getSquiggleCode(nodes, nodeId);
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}

export function StaticCustomNodeGraph({
  showing,
  nodeId,
}: {
  showing: boolean;
  nodeId: string;
}) {
  if (!showing) return null;
  return <StaticCustomNodeInner nodeId={nodeId} />;
}

function StaticCustomNodeInner({ nodeId }: { nodeId: string }) {
  const nodes = usePublicStoreOrThrow((s) => s.storage.data.nodes);
  const code = getSquiggleCodeStatic(nodes, nodeId);
  console.log(code);
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}

/** Returns all the squiggle code needed to run for a given node */
function getSquiggleCode(nodes: LiveNodes | undefined, nodeId: string) {
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
}

/** Returns all the squiggle code needed to run for a given node */
function getSquiggleCodeStatic(nodes: Nodes, nodeId: string) {
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
    const node = nodes.data[id];
    if (!node) continue;
    // Don't check nodes twice
    if (id in nodeIds) continue;
    nodeIds.push(id);

    const value = node.data.value ?? "";
    idToVarNameAndValue[id] = [node.data.variableName, value];

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
