import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { BiX } from "react-icons/bi";
import { useMutation } from "@/liveblocks.config";
import { useCallback } from "react";

/** Use this to change the path for both edges */
const getPath = getBezierPath;

export default function GraphEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeSuggestedEdge = useMutation(({ storage }, id: string) => {
    storage.get("suggestedEdges").delete(id);
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      removeSuggestedEdge(id);
    },
    [removeSuggestedEdge, id]
  );

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button
            className="edgebutton rounded-full p-1 text-xl bg-black text-white shadow opacity-30 hover:opacity-100"
            onClick={onClick}
          >
            <BiX />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export function GraphEdgeImmutable({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={style}
      data-edge-id={id}
    />
  );
}
