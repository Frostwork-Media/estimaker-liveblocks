import classNames from "classnames";
import { BiLoaderAlt } from "react-icons/bi";

export function SmallSpinner({
  colorClass = "text-slate-300",
}: {
  colorClass?: string;
}) {
  return (
    <BiLoaderAlt className={classNames("animate-spin w-4 h-4", colorClass)} />
  );
}

export function LargeSpinner({
  colorClass = "text-slate-300",
}: {
  colorClass?: string;
}) {
  return (
    <BiLoaderAlt className={classNames("animate-spin w-8 h-8", colorClass)} />
  );
}
