import { useCallback } from "react";
import { useMutation, useStorage } from "../liveblocks.config";
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
import {
  CUSTOM_EDGE,
  METAFORECAST_NODE,
  SQUIGGLE_NODE,
} from "../lib/constants";
import {
  useAddSquiggleNodeAtPosition,
  useLiveAddSuggestedEdge,
} from "@/lib/useLive";
import { NodePanel } from "./NodePanel";
import { useGraphStore } from "../lib/useGraphStore";
import { createNodes } from "../lib/createNodes";
import { useEdges } from "@/lib/useEdges";
import { GraphNode } from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { useKeyboardListeners } from "@/lib/hooks";
import { MetaforecastSearch } from "./MetaforecastSearch";
import { MetaforecastNode } from "./MetaforecastNode";
import { NodeTypes as TNodeTypes } from "shared";
import { useProjectCode } from "@/lib/useProjectCode";
import { useSquiggleEnv } from "@/lib/useSquiggleRunResult";
import { focusNodeTitleInput } from "@/lib/helpers";

const nodeTypes: NodeTypes = {
  [SQUIGGLE_NODE]: GraphNode,
  [METAFORECAST_NODE]: MetaforecastNode,
};

const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: GraphEdge,
};

export default function Graph() {
  const code = useProjectCode();
  useSquiggleEnv(code);
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}

function GraphInner() {
  const squiggle = useStorage((state) => state.squiggle);
  const selected = useGraphStore((state) => state.selected);
  const metaforecast = useStorage((state) => state.metaforecast);
  const nodes = createNodes({ squiggle, selected, metaforecast });

  const suggestedEdges = useStorage((state) =>
    Object.entries(state.suggestedEdges)
  ) as [string, string[]][];

  // Create edges for react flow
  const edges = useEdges(squiggle, suggestedEdges);

  const updateNodePosition = useMutation(
    (
      { storage },
      id: string,
      args: { nodeType: TNodeTypes; x: number; y: number }
    ) => {
      if (args.nodeType === "squiggle") {
        const node = storage.get("squiggle").get(id);
        node.set("x", args.x);
        node.set("y", args.y);
      } else if (args.nodeType === "metaforecast") {
        const node = storage.get("metaforecast").get(id);
        node.set("x", args.x);
        node.set("y", args.y);
      }
    },
    []
  );
  const reactFlow = useReactFlow();
  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      for (const change of changes) {
        switch (change.type) {
          case "position": {
            const position = change.position;
            if (!position) return;
            const { x, y } = position;
            const node = reactFlow.getNode(change.id);
            if (node)
              updateNodePosition(change.id, {
                x,
                y,
                nodeType: node.type as TNodeTypes,
              });
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
    [reactFlow, updateNodePosition]
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

      const id = addSquiggleNode(projectedCoords);
      // set selected
      useGraphStore.setState({ selected: [id] });
      // Focus the title input
      focusNodeTitleInput(id);
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

      // ID of node we're connecting to
      const toConnectId = connecting.nodeId;
      if (!toConnectId) return;
      const node = reactFlowInstance.getNode(toConnectId);

      // Create the node
      const nodeId = addSquiggleNode({
        ...coords,
        initialValue: node?.data.variableName,
      });

      if (toConnectId) {
        if (connecting.handleType === "target") {
          liveAddSuggestedEdge([nodeId, toConnectId]);
        } else {
          liveAddSuggestedEdge([toConnectId, nodeId]);
        }
      }

      // set selected
      requestAnimationFrame(() => {
        useGraphStore.setState({ selected: [nodeId] });

        // Focus the title input
        focusNodeTitleInput(nodeId);

        // Reset the connecting state
        useGraphStore.setState({ connecting: null });
      });
    },
    [addSquiggleNode, liveAddSuggestedEdge, reactFlowInstance]
  );

  const ref = useKeyboardListeners();

  return (
    <>
      <div className="w-full h-full bg-[white]" ref={ref}>
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          zoomOnDoubleClick={false}
          onDoubleClick={addNodeOnDblClick}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          maxZoom={1}
          selectNodesOnDrag={false}
          fitView
        >
          <Controls />
          <Panel position="bottom-center">
            <NodePanel />
          </Panel>
        </ReactFlow>
      </div>
      <MetaforecastSearch />
    </>
  );
}
