import { useStorage } from "@/liveblocks.config";

export function useLiveNodes() {
  return useStorage((state) => state.nodes);
}
