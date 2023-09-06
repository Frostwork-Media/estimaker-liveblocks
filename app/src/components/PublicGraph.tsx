import "reactflow/dist/style.css";
import { createNodes } from "@/lib/createNodes";
import ReactFlow, { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow";
import { SimplifiedStorage } from "shared";
import { useEdges } from "@/lib/useEdges";
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
  const nodesArray = Object.entries(props.nodes);
  const nodes = createNodes(nodesArray, []);
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
