import { SquiggleChart } from "@quri/squiggle-components";
import { getSquiggleCode } from "../lib/getSquiggleCode";
import { useSquiggleNodes } from "../lib/useSquiggleNodes";

export function SquiggleGraph({ nodeId }: { nodeId: string }) {
  const nodes = useSquiggleNodes();
  const code = getSquiggleCode(Object.entries(nodes), nodeId);
  return (
    <div className="w-full">
      <SquiggleChart code={code} />
    </div>
  );
}
