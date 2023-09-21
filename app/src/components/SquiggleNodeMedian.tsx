import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useProjectCode } from "@/lib/useProjectCode";
import { ProcessedSquiggleNodeType } from "@/lib/useSquiggleRunResult";
import { run } from "@quri/squiggle-lang";
import { useEffect, useState } from "react";

export function SquiggleNodeMedian({
  nodeType,
  variableName,
  value,
}: {
  nodeType?: ProcessedSquiggleNodeType;
  variableName: string;
  value: string;
}) {
  const code = useProjectCode();

  /**
   * This stores the last line of our squiggle code which will return our median.
   */
  const whatToRunForMedian =
    nodeType === "distribution" ? `quantile(${variableName}, 0.5)` : null;

  const [median, setMedian] = useState<string>("...");

  const fullCode = [code, whatToRunForMedian].join("\n");
  const debouncedFullCode = useDebouncedValue(fullCode, 1000);

  useEffect(() => {
    if (!whatToRunForMedian) return;
    run(debouncedFullCode).then((result) => {
      if (!result.ok) return;

      let median: number | string = parseFloat(result.value.result.toString());

      // is median between 1 and 0 inclusive?
      if (median >= 0 && median <= 1) {
        median = Math.round(median * 100) + "%";
      } else {
        // Keep up to 3 significant digits
        median = median.toPrecision(3);
      }

      setMedian(median.toString());
    });
  }, [debouncedFullCode, whatToRunForMedian]);

  if (!nodeType || !variableName) return null;

  return (
    <div className="w-full text-center">
      <span className="inline-block text-2xl font-mono py-2 px-3 bg-slate-100 rounded">
        {nodeType === "value"
          ? value
          : nodeType === "function"
          ? value
          : median}
      </span>
    </div>
  );
}
