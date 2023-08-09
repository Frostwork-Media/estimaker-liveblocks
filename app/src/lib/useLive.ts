import { useMutation, useStorage } from "@/liveblocks.config";

export function useLiveNodes() {
  return useStorage((state) => state.nodes);
}

export function useLiveSuggestedEdges() {
  return useStorage((state) => state.suggestedEdges);
}

export function useLiveAddSuggestedEdge() {
  return useMutation(({ storage }, dependency: [string, string]) => {
    const suggestedEdges = storage.get("suggestedEdges");
    suggestedEdges.set(dependency.join("-"), dependency);
  }, []);
}
