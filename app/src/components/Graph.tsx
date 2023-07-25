import { useCallback, useMemo } from "react";
import { useMutation, useSelf, useStorage } from "../liveblocks.config";
import ReactFlow, { Controls, Background, BackgroundVariant } from "reactflow";
import type { OnNodesChange, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import { AppEdge, AppNode } from "../lib/types";
import { CUSTOM_NODE, squiggleReservedWords } from "../lib/constants";
import { CustomNode } from "./CustomNode";
import { getVariables } from "../lib/helpers";

type NodesArray = [
  string,
  {
    readonly content: string;
    readonly variableName: string;
    readonly x: number;
    readonly y: number;
    readonly showing?: "graph";
  }
][];

export function Graph() {
  const values = useStorage((state) => state.values);
  const initialNodes = useStorage((state) => state.nodes);
  const nodesArray = Array.from(initialNodes?.entries() ?? []);
  const selfId = useSelf()?.id;
  const nodes = toReactFlowNodes({ nodesArray, selfId, values });

  const updateNodePosition = useMutation(
    ({ storage }, id: string, position: { x: number; y: number }) => {
      const nodes = storage.get("nodes");
      const node = nodes.get(id);
      if (!node) return;
      node.set("x", position.x);
      node.set("y", position.y);
    },
    []
  );

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      for (const change of changes) {
        switch (change.type) {
          case "position": {
            const position = change.position;
            if (!position) return;
            const { x, y } = position;
            updateNodePosition(change.id, { x, y });
            break;
          }
          default: {
            // applyNodeChanges(nodes, change);
          }
        }
      }
    },
    [updateNodePosition]
  );

  const nodeTypes = useMemo<NodeTypes>(() => {
    return {
      [CUSTOM_NODE]: CustomNode,
    };
  }, []);

  const edges = useMemo<AppEdge[]>(() => {
    if (!values || !initialNodes) return [];
    // from, to, userId
    const edges: AppEdge[] = [];
    for (const key of values.keys()) {
      const [userId, targetNodeId] = key.split(":");

      const value = values.get(key);
      if (!value) continue;

      const node = initialNodes.get(targetNodeId);
      if (!node) continue;

      for (const variableName of getVariables(value)) {
        // find the node with this variable name
        const sourceNodeId = Array.from(initialNodes.entries()).find(
          ([_id, node]) => {
            return node.variableName === variableName;
          }
        )?.[0];

        if (typeof sourceNodeId !== "string") continue;

        edges.push({
          id: `${sourceNodeId}-${targetNodeId}-${userId}`,
          source: sourceNodeId,
          target: targetNodeId,
          style: {
            stroke: "#35a3ce",
            strokeWidth: 3,
          },
        });
      }
    }
    return edges;
  }, [values, initialNodes]);

  return (
    <div className="w-full h-full bg-[white]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={[25, 25]}
      >
        <Controls />
        <Background
          variant={BackgroundVariant.Lines}
          gap={25}
          size={1}
          color="#f3f3f3"
        />
      </ReactFlow>
    </div>
  );
}

function toReactFlowNodes({
  nodesArray,
  selfId,
  values,
}: {
  nodesArray: NodesArray;
  selfId?: string;
  values: ReadonlyMap<string, string> | null;
}): AppNode[] {
  const nodes: AppNode[] = [];

  for (const [id, node] of nodesArray) {
    nodes.push({
      id,
      data: {
        label: node.content,
        variableName: node.variableName,
        selfValue: values?.get(`${selfId}:${id}`) ?? "",
        showing: node.showing,
      },
      position: { x: node.x, y: node.y },
      type: CUSTOM_NODE,
    });
  }

  return nodes;
}
