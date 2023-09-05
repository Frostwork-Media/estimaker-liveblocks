import "reactflow/dist/style.css";
import { fromPublicToReactFlowNodes } from "@/lib/toReactFlowNodes";
import ReactFlow, { ReactFlowProvider } from "reactflow";
import { PublicProject } from "shared";
import { publicEdgeTypes, publicNodeTypes } from "./shared";
import { useEdgesStatic } from "@/lib/useEdges";

/**
 * In theory, these should be the shared graph props
 * which work for both the public and private graphs
 */
type GraphProps = {
  nodes: PublicProject["storage"]["data"]["nodes"]["data"];
  suggestedEdges: PublicProject["storage"]["data"]["suggestedEdges"]["data"];
};

/**
 * This is the public graph, it should be kept in sync
 * with the main graph as much as possible where they
 * share their rendering but one work with liveblocks
 * storage and the other works with the static version
 */
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
        nodeTypes={publicNodeTypes}
        edgeTypes={publicEdgeTypes}
        nodes={nodes}
        edges={edges}
        draggable={false}
        minZoom={-Infinity}
        fitView
      />
    </div>
  );
}
