import { SmallSpinner } from "../SmallSpinner";
import { numberToPercentage } from "@/lib/numberToPercentage";

export function MarketLink({
  isLoading,
  url,
  title,
  probability,
  error,
  community,
}: {
  isLoading: boolean;
  url?: string;
  title?: string;
  probability?: number;
  error: boolean;
  community: "Manifold" | "Metaculus";
}) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-1">
        <img
          src="/manifold-market-logo.svg"
          className="w-6 h-6 -translate-y-px"
          alt="Manifold Markets Logo"
        />

        <div className="text-sm text-slate-500">{community}</div>
      </div>
      {isLoading ? (
        <SmallSpinner />
      ) : error ? (
        <span className="text-red-500 text-center text-sm rounded-full p-1 bg-red-100">
          Error
        </span>
      ) : title && url && probability != null ? (
        <a
          className="grid gap-1 text-slate-600"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-sm grow">{title}</span>
          <span
            className="bg-slate-100 text-center font-mono overflow-hidden whitespace-nowrap overflow-ellipsis"
            title={probability.toString()}
          >
            {numberToPercentage(probability)}
          </span>
        </a>
      ) : null}
    </div>
  );
}
