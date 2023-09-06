import "reactflow/dist/style.css";
import { fromPublicToReactFlowNodes } from "@/lib/toReactFlowNodes";
import ReactFlow, { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow";
import { PublicProject } from "shared";
import { useEdgesStatic } from "@/lib/useEdges";
import { CUSTOM_EDGE, CUSTOM_NODE } from "@/lib/constants";
import { FrozenCustomNode } from "./CustomNode";
import { FrozenCustomEdge } from "./CustomEdge";

const nodeTypes: NodeTypes = {
  [CUSTOM_NODE]: FrozenCustomNode,
};

const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: FrozenCustomEdge,
};

type GraphProps = {
  nodes: PublicProject["storage"]["data"]["nodes"]["data"];
  suggestedEdges: PublicProject["storage"]["data"]["suggestedEdges"]["data"];
};

export function PublicGraph(props: GraphProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}

function GraphInner(props: GraphProps) {
  const nodes = fromPublicToReactFlowNodes(props.nodes);
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
