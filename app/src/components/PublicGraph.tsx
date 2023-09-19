import "reactflow/dist/style.css";
import { createNodes } from "@/lib/createNodes";
import ReactFlow, { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow";
import { useEdges } from "@/lib/useEdges";
import { CUSTOM_EDGE, SQUIGGLE_NODE } from "@/lib/constants";
import { GraphNodeImmutable } from "./GraphNode";
import { GraphEdgeImmutable } from "./GraphEdge";
import { Schema } from "shared";

const nodeTypes: NodeTypes = {
  [SQUIGGLE_NODE]: GraphNodeImmutable,
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

function GraphInner({ squiggle, suggestedEdges }: Schema) {
  // TO DO: Add real market nodes here
  const nodes = createNodes({
    squiggle,
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
