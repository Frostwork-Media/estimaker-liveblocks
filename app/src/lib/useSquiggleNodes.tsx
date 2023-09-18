import { useContext } from "react";
import { SquiggleNodesContext } from "../components/SquiggleNodesProvider";

export function useSquiggleNodes() {
  return useContext(SquiggleNodesContext).nodes;
}
