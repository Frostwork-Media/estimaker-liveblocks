import { getVariables } from "../lib/helpers";
import { useSelf, useStorage } from "../liveblocks.config";
import { SquiggleChart } from "@quri/squiggle-components";
import toposort from "toposort";

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
  const nodes = useStorage((state) => state.nodes);
  const values = useStorage((state) => state.values);
  const self = useSelf();
  const selfId = self?.id;
  if (!selfId || !values || !nodes) return null;
  const code = getSquiggleCode(selfId, nodes, values, nodeId);
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}

function getSquiggleCode(
  selfId: string,
  nodes: ReadonlyMap<
    string,
    {
      readonly content: string;
      readonly variableName: string;
      readonly x: number;
      readonly y: number;
      readonly showing?: "graph" | undefined;
    }
  >,
  values: ReadonlyMap<string, string>,
  nodeId: string
) {
  if (!nodes) return "";
  const idsToCheck = [nodeId];
  const deps: [string, string][] = [];
  const nodeIds: string[] = [];

  const idToVarNameValue: Record<string, [string, string]> = {};

  while (idsToCheck.length) {
    const id = idsToCheck.pop();
    if (!id) continue;
    const node = nodes.get(id);
    if (!node) continue;

    nodeIds.push(id);

    const value = values?.get(`${selfId}:${id}`);
    idToVarNameValue[id] = [node.variableName, value ?? ""];
    if (!value) continue;
    for (const variableName of getVariables(value)) {
      // find the node with this variable name
      const sourceNodeId = Array.from(nodes.entries()).find(([_id, node]) => {
        return node.variableName === variableName;
      })?.[0];

      if (typeof sourceNodeId !== "string") continue;
      deps.push([sourceNodeId, id]);
      idsToCheck.push(sourceNodeId);
    }
  }

  const sortedIds = toposort.array(nodeIds, deps);

  const code =
    sortedIds
      .map((id) => {
        const [variableName, value] = idToVarNameValue[id];
        return `${variableName} = ${value}`;
      })
      .join("\n") + `\n${idToVarNameValue[nodeId][0]}`;

  return code;
}
