import { useLiveNodes } from "@/lib/useLive";
import { SquiggleChart } from "@quri/squiggle-components";
import { usePublicStoreOrThrow } from "@/lib/usePublicStore";
import { getSquiggleCode } from "../lib/getSquiggleCode";
import { getSquiggleCodeImmutable } from "@/lib/getSquiggleCode";

export function SquiggleGraph({
  showing,
  nodeId,
}: {
  showing: boolean;
  nodeId: string;
}) {
  if (!showing) return null;
  return <Inner nodeId={nodeId} />;
}

function Inner({ nodeId }: { nodeId: string }) {
  const nodes = useLiveNodes();
  const code = getSquiggleCode(nodes, nodeId);
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}

/**
 * The squiggle graph used in the public view
 */
export function SquiggleGraphImmutable({
  showing,
  nodeId,
}: {
  showing: boolean;
  nodeId: string;
}) {
  if (!showing) return null;
  return <InnerImmutable nodeId={nodeId} />;
}

function InnerImmutable({ nodeId }: { nodeId: string }) {
  const nodes = usePublicStoreOrThrow((s) => s.storage.nodes);
  const code = getSquiggleCodeImmutable(nodes, nodeId);
  return (
    <div className="w-full">
      <SquiggleChart code={code} enableLocalSettings />
    </div>
  );
}
