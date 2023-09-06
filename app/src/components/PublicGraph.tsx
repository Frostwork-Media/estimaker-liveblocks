import "reactflow/dist/style.css";
import { createNodesImmutable } from "@/lib/createNodes";
import ReactFlow, { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow";
import { SimplifiedStorage } from "shared";
import { useEdgesStatic } from "@/lib/useEdges";
import { CUSTOM_EDGE, CUSTOM_NODE } from "@/lib/constants";
import { GraphNodeImmutable } from "./GraphNode";
import { GraphEdgeImmutable } from "./GraphEdge";

const nodeTypes: NodeTypes = {
  [CUSTOM_NODE]: GraphNodeImmutable,
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
  const nodes = createNodesImmutable(props.nodes);
  const suggestedEdges = props.suggestedEdges;
  const edges = useEdgesStatic(props.nodes, suggestedEdges);
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
