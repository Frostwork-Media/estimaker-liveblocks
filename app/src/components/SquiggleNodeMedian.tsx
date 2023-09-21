import { getSquiggleCode } from "@/lib/getSquiggleCode";
import { useSquiggleNodes } from "@/lib/useSquiggleNodes";
import { SquiggleChart } from "@quri/squiggle-components";

export function SquiggleNodeMedian({ nodeId }: { nodeId: string }) {
  const nodes = useSquiggleNodes();
  const code = getSquiggleCode(Object.entries(nodes), nodeId, "median");
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}
