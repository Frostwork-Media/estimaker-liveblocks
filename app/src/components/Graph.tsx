import { useCallback } from "react";
import { useMutation } from "../liveblocks.config";
import ReactFlow, {
  Controls,
  OnConnect,
  OnConnectEnd,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import type {
  OnNodesChange,
  OnConnectStart,
  NodeTypes,
  EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { CUSTOM_EDGE, CUSTOM_NODE, MANIFOLD_NODE } from "../lib/constants";
import {
  useAddSquiggleNodeAtPosition,
  useLiveAddSuggestedEdge,
  useLiveNodes,
  useLiveSuggestedEdges,
  useLiveMarketNodes,
} from "@/lib/useLive";
import { NodePanel } from "./NodePanel";
import { useGraphStore } from "../lib/useGraphStore";
import { createNodes } from "../lib/createNodes";
import { useEdges } from "@/lib/useEdges";
import { GraphNode } from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { useForwardSlashListener } from "@/lib/hooks";
import { FloatingGraphDropdown } from "./FloatingGraphDropdown";
import { ManifoldNode } from "./ManifoldNode";

const nodeTypes: NodeTypes = {
  [CUSTOM_NODE]: GraphNode,
  [MANIFOLD_NODE]: ManifoldNode,
};

const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: GraphEdge,
};

export default function Graph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}

function GraphInner() {
  const liveNodes = useLiveNodes();
  const liveNodesArray = Array.from(liveNodes.entries());
  const selectedIds = useGraphStore((state) => state.selected);
  const marketNodes = useLiveMarketNodes();
  const marketNodesArray = Array.from(marketNodes.entries());
  const nodes = createNodes(liveNodesArray, marketNodesArray, selectedIds);

  const liveSuggestedEdges = useLiveSuggestedEdges();
  const liveSuggestedEdgesArray = Array.from(liveSuggestedEdges.entries());

  // Create edges for react flow
  const edges = useEdges(liveNodesArray, liveSuggestedEdgesArray);

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
          case "select": {
            const { id, selected } = change;
            const selectedIds = useGraphStore.getState().selected;
            if (selected) {
              useGraphStore.setState({
                selected: [...selectedIds, id],
              });
            } else {
              useGraphStore.setState({
                selected: selectedIds.filter((selectedId) => selectedId !== id),
              });
            }
            break;
          }
          default: {
            // Not sure if this should be used or not
            // applyNodeChanges(nodes, change);
            // console.log("Unhandled change", change);
          }
        }
      }
    },
    [updateNodePosition]
  );

  const addSquiggleNode = useAddSquiggleNodeAtPosition();

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

      addSquiggleNode(projectedCoords);
    },
    [addSquiggleNode, reactFlowInstance]
  );

  const liveAddSuggestedEdge = useLiveAddSuggestedEdge();

  const onConnectStart = useCallback<OnConnectStart>((_event, params) => {
    useGraphStore.setState({ connecting: params });
  }, []);

  const onConnect = useCallback<OnConnect>(
    ({ source, target }) => {
      if (source && target) {
        liveAddSuggestedEdge([source, target]);
        useGraphStore.setState({ connecting: null });
      }
    },
    [liveAddSuggestedEdge]
  );

  /**
   * Auto-create a node and connect it when dragging to nowhere
   */
  const onConnectEnd = useCallback<OnConnectEnd>(
    (event) => {
      const connecting = useGraphStore.getState().connecting;
      if (!connecting) return;

      // Create a new node where the user stopped dragging
      const x =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const y =
        event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      const coords = reactFlowInstance.project({ x, y });
      const nodeId = addSquiggleNode(coords);

      // Create a suggested edge between the node the user started dragging
      const toConnectId = connecting.nodeId;
      if (toConnectId) {
        if (connecting.handleType === "target") {
          liveAddSuggestedEdge([nodeId, toConnectId]);
        } else {
          liveAddSuggestedEdge([toConnectId, nodeId]);
        }
      }

      // Reset the connecting state
      useGraphStore.setState({ connecting: null });
    },
    [addSquiggleNode, liveAddSuggestedEdge, reactFlowInstance]
  );

  const ref = useForwardSlashListener();

  return (
    <>
      <div className="w-full h-full bg-[white]" ref={ref}>
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          // snapToGrid={true}
          // snapGrid={snapGrid}
          zoomOnDoubleClick={false}
          onDoubleClick={addNodeOnDblClick}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          fitView
        >
          <Controls />
          <Panel position="bottom-center">
            <NodePanel />
          </Panel>
          {/* <Background
          variant={BackgroundVariant.Lines}
          gap={25}
          size={1}
          color="#f3f3f3"
        /> */}
        </ReactFlow>
      </div>
      <FloatingGraphDropdown />
    </>
  );
}
