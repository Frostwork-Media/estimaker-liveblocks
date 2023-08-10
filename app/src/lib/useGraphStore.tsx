import type { OnConnectStartParams } from "reactflow";
import { create } from "zustand";

/**
 * This stores local-user state (not shared)
 * about the graph
 */
export const useGraphStore = create<{
  /** Stores the node that the user starts from when making a connection */
  connecting: null | OnConnectStartParams;
  /** Selected Node Ids */
  selected: string[];
}>((_set) => ({
  connecting: null,
  selected: [],
}));
