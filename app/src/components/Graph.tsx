import { useCallback, useMemo } from "react";
import { useMutation } from "../liveblocks.config";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import type { OnNodesChange, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import { AppEdge, AppNode } from "../lib/types";
import { CUSTOM_NODE } from "../lib/constants";
import { CustomNode } from "./CustomNode/CustomNode";
import { getVariables } from "../lib/helpers";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";
import { useLiveNodes } from "@/lib/useLive";

const snapGrid = [25, 25] as [number, number];

export function Graph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}

function GraphInner() {
  const liveNodes = useLiveNodes();
  const nodes = toReactFlowNodes(liveNodes);

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

  // Create edges for react flow
  const edges = useMemo<AppEdge[]>(() => {
    const nodesArray = Array.from(liveNodes?.entries() ?? []);
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
          id: `${id}:${sourceNodeId}`,
          source: sourceNodeId,
          target: id,
          style: { stroke: "#ccc", strokeWidth: "4px" },
        });
      }
    }
    return edges;
  }, [liveNodes]);

  const addNode = useMutation(
    ({ storage }, position: { x: number; y: number }) => {
      const nodes = storage.get("nodes");
      const node = new LiveObject({
        content: "",
        variableName: `var${nodes.size + 1}`,
        ...position,
        value: "",
      });
      const id = nanoid();
      nodes.set(id, node);
      setTimeout(() => {
        // Find the element with the [data-id] attribute equal to the
        // id of the node we just created
        const element = document.querySelector(`[data-id="${id}"]`);
        if (!element) return;

        // find the data-rename-button within that element
        const renameButton = element.querySelector(
          "[data-rename-button]"
        ) as HTMLButtonElement;
        if (!renameButton) return;

        // click it
        renameButton.click();
      }, 0);
    },
    []
  );

  const reactFlowInstance = useReactFlow();

  const addNodeOnDblClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // check if an element is focused anywhere in the document
      const focusedElement = document.querySelector(":focus");
      if (focusedElement) {
        // This avoids creating a node when the user
        // is trying to edit a node title
        return;
      }

      const projectedCoords = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(projectedCoords);
    },
    [addNode, reactFlowInstance]
  );

  return (
    <div className="w-full h-full bg-[white]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        zoomOnDoubleClick={false}
        onDoubleClick={addNodeOnDblClick}
        fitView
      >
        <Controls />
        {/* <Background
          variant={BackgroundVariant.Lines}
          gap={25}
          size={1}
          color="#f3f3f3"
        /> */}
      </ReactFlow>
    </div>
  );
}

function toReactFlowNodes(
  liveNodes: ReturnType<typeof useLiveNodes>
): AppNode[] {
  const nodesArray = Array.from(liveNodes.entries());
  const nodes: AppNode[] = [];

  for (const [id, node] of nodesArray) {
    nodes.push({
      id,
      data: {
        label: node.content,
        variableName: node.variableName,
        selfValue: node.value,
        showing: node.showing,
      },
      position: { x: node.x, y: node.y },
      type: CUSTOM_NODE,
    });
  }

  return nodes;
}
