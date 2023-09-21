import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useProjectCode } from "@/lib/useProjectCode";
import { ProcessedSquiggleNodeType } from "@/lib/useSquiggleRunResult";
import { run } from "@quri/squiggle-lang";
import { useEffect, useState } from "react";

export function SquiggleNodeMedian({
  nodeType,
  variableName,
}: {
  nodeType?: ProcessedSquiggleNodeType;
  variableName: string;
}) {
  const code = useProjectCode();

  const [median, setMedian] = useState<string | null>(null);

  const lastLine =
    nodeType === "distribution"
      ? `quantile(${variableName}, 0.5)`
      : // ? `quantile(${variableName}, 0.5)`
      nodeType === "value"
      ? variableName
      : null;

  const fullCode = [code, lastLine].join("\n");
  const debouncedFullCode = useDebouncedValue(fullCode, 1000);

  useEffect(() => {
    run(debouncedFullCode).then((result) => {
      if (!result.ok) return;
      setMedian(result.value.result.toString());
    });
  }, [debouncedFullCode]);

  if (!nodeType || !variableName) return null;
  if (!lastLine) return null;

  return (
    <div className="w-full">
      <span>{median}</span>
    </div>
  );
}
