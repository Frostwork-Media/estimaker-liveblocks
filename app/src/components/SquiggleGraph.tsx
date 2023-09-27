import { SquiggleChart } from "@quri/squiggle-components";
import { useProjectCode } from "@/lib/useProjectCode";
import { SquiggleNode } from "shared";

export function SquiggleGraph({
  variableName,
  overrides,
}: {
  variableName: string;
  overrides: SquiggleNode["overrides"];
}) {
  const projectCode = useProjectCode();
  const code = `{${projectCode}\n${variableName}}`;

  // if there are non-empty overrides, show a plot with both as distributions... make that assumption for now
  if (Object.values(overrides).filter((v) => v !== "").length > 0) {
    const dists = [`{ name: "Default", value: ${variableName} }`];
    for (const [key, value] of Object.entries(overrides)) {
      dists.push(`{ name: "${key}", value: ${value} }`);
    }
    const distsCode = `{${projectCode}\nPlot.dists({
      dists: [ ${dists.join(", ")} ]
  })}`;

    console.log({ distsCode });

    return (
      <SquiggleChart
        key={variableName}
        code={distsCode}
        showHeader={false}
        localSettingsEnabled={false}
        chartHeight={100}
        distributionChartSettings={{
          showSummary: false,
        }}
      />
    );
  }

  return (
    <SquiggleChart
      key={variableName}
      code={code}
      showHeader={false}
      localSettingsEnabled={false}
      chartHeight={100}
      distributionChartSettings={{
        showSummary: false,
      }}
    />
  );
}
