import { customNodeWidthClass } from "@/lib/constants";
import { getMetaforecast } from "@/lib/searchMetaforecast";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { CSSProperties } from "react";
import { NodeProps } from "reactflow";
import {
  MetaforecastResponse,
  Option as TOption,
  MetaforecastNode as TMetaforecastNode,
} from "shared";
import { BiChevronRight } from "react-icons/bi";

export function MetaforecastNode({
  data,
}: NodeProps<Omit<TMetaforecastNode, "x" | "y">>) {
  const query = useQuery<MetaforecastResponse>(
    ["metaforecast", data.link],
    () => {
      return getMetaforecast(data.link);
    },
    {
      enabled: !!data.link,
    }
  );
  return (
    <div
      className={classNames(
        "border rounded shadow p-4 bg-slate-100 border-slate-400",
        customNodeWidthClass
      )}
    >
      {query.isLoading && "..."}
      {query.data ? (
        <div className="grid gap-2">
          <h3 className="text-3xl">{query.data.title}</h3>
          {query.data.options.length ? (
            <div className="grid gap-1">
              {query.data.options.map((option) => (
                <Option key={option.name} option={option} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <a
        href={query.data?.url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-800 hover:underline flex items-center mt-2"
      >
        Open on {query.data?.platform.label}
        <BiChevronRight className="inline-block ml-1" />
      </a>
    </div>
  );
}

function Option({ option }: { option: TOption }) {
  if (option.__typename !== "ProbabilityOption") return null;
  return (
    <div className="flex gap-1">
      <span
        className={classNames("rounded p-1 min-w-[50px] text-center", {
          "bg-green-700": option.name === "Yes",
          "bg-red-700": option.name === "No",
          "bg-white": option.name !== "Yes" && option.name !== "No",
        })}
      >
        {option.name === "Yes" ? (
          <span className="translate-y-[2px] inline-block">👍</span>
        ) : option.name === "No" ? (
          <span className="translate-y-[3px] inline-block">👎</span>
        ) : (
          option.name
        )}
      </span>
      <div
        className="inner flex-grow rounded bg-slate-300 relative overflow-hidden"
        style={{ "--probability": option.probability } as CSSProperties}
      >
        <div className="option-amount-fill" />
      </div>
      <span className="rounded p-1 min-w-[50px] text-center whitespace-nowrap">
        {Math.round(option.probability * 100)}%
      </span>
    </div>
  );
}
