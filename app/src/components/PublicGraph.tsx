import "reactflow/dist/style.css";
import { createNodes } from "@/lib/createNodes";
import ReactFlow, { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow";
import { useEdges } from "@/lib/useEdges";
import { CUSTOM_EDGE, SQUIGGLE_NODE, MANIFOLD_NODE } from "@/lib/constants";
import { GraphNodeImmutable } from "./GraphNode";
import { GraphEdgeImmutable } from "./GraphEdge";
import { PublicManifoldNode } from "./ManifoldNode";
import { Schema } from "shared";

const nodeTypes: NodeTypes = {
  [SQUIGGLE_NODE]: GraphNodeImmutable,
  [MANIFOLD_NODE]: PublicManifoldNode,
};

const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: GraphEdgeImmutable,
};

export function PublicGraph(props: Schema) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}

function GraphInner({ squiggle, suggestedEdges, manifold }: Schema) {
  // TO DO: Add real market nodes here
  const nodes = createNodes({
    squiggle,
    manifold,
    selected: [],
  });

  const suggestedEdgesArray = Object.entries(suggestedEdges);
  const edges = useEdges(squiggle, suggestedEdgesArray);
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
