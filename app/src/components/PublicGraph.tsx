import "reactflow/dist/style.css";
import { createNodes } from "@/lib/createNodes";
import ReactFlow, { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow";
import { SimplifiedStorage } from "shared";
import { useEdges } from "@/lib/useEdges";
import { CUSTOM_EDGE, SQUIGGLE_NODE, MANIFOLD_NODE } from "@/lib/constants";
import { GraphNodeImmutable } from "./GraphNode";
import { GraphEdgeImmutable } from "./GraphEdge";
import { PublicManifoldNode } from "./ManifoldNode";

const nodeTypes: NodeTypes = {
  [SQUIGGLE_NODE]: GraphNodeImmutable,
  [MANIFOLD_NODE]: PublicManifoldNode,
};

const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: GraphEdgeImmutable,
};

export function PublicGraph(props: SimplifiedStorage) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}

function GraphInner(props: SimplifiedStorage) {
  const nodesArray = Object.entries(props.squiggle ?? {});
  // TODO: Add real market nodes here
  const nodes = createNodes({
    squiggle: nodesArray,
    manifold: props.manifold,
    selectedIds: [],
  });
  const suggestedEdges = props.suggestedEdges;
  const suggestedEdgesArray = Object.entries(suggestedEdges);
  const edges = useEdges(nodesArray, suggestedEdgesArray);
  return (
    <div className="w-full h-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        draggable={false}
        minZoom={-Infinity}
        fitView
      />
    </div>
  );
}
