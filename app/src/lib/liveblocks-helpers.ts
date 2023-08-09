import { useStorage } from "@/liveblocks.config";

export function useNodes() {
  return useStorage((state) => state.nodes);
}
