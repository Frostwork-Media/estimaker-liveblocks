import { BiLoaderAlt } from "react-icons/bi";

export function SmallSpinner() {
  return <BiLoaderAlt className="animate-spin w-4 h-4 text-neutral-300" />;
}

export function LargeSpinner() {
  return <BiLoaderAlt className="animate-spin w-8 h-8 text-neutral-300" />;
}
