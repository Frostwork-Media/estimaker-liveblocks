import { SquiggleChart } from "@quri/squiggle-components";
import { getSquiggleCode } from "../lib/getSquiggleCode";

export function SquiggleGraph({
  nodeId,
  nodes,
}: {
  nodeId: string;
  nodes: Parameters<typeof getSquiggleCode>[0];
}) {
  const code = getSquiggleCode(nodes, nodeId);
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}
