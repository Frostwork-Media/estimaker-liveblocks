import { useMutation, useStorage } from "@/liveblocks.config";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { customNodeWidth } from "./constants";
import { nanoid } from "nanoid";

export function useLiveNodes() {
  return useStorage((state) => state.nodes);
}

export type LiveNodes = ReturnType<typeof useLiveNodes>;
export type LiveNode = LiveNodes extends ReadonlyMap<any, infer V> ? V : never;

export function useLiveSuggestedEdges() {
  return useStorage((state) => state.suggestedEdges);
}

export type LiveSuggestedEdges = ReturnType<typeof useLiveSuggestedEdges>;

export function useLiveAddSuggestedEdge() {
  return useMutation(({ storage }, dependency: [string, string]) => {
    const suggestedEdges = storage.get("suggestedEdges");
    suggestedEdges.set(dependency.join("-"), dependency);
  }, []);
}

export function useAddSquiggleNodeAtPosition() {
  return useMutation(({ storage }, position: { x: number; y: number }) => {
    const nodes = storage.get("nodes");
    const node = new LiveObject({
      content: "",
      variableName: `var${nodes.size + 1}`,
      // We move the x position back by half of the node width, so it's centered
      x: position.x - customNodeWidth / 2,
      // Not sure
      y: position.y - 50,
      value: "",
    });
    const id = nanoid();
    nodes.set(id, node);

    // Auto-select the input for naming the node
    setTimeout(() => {
      // Find the element with the [data-id] attribute equal to the
      // id of the node we just created
      const element = document.querySelector(`[data-id="${id}"]`);
      if (!element) return;

      // find the data-rename-button within that element
      const renameButton = element.querySelector(
        "[data-rename-button]"
      ) as HTMLButtonElement;
      if (!renameButton) return;

      // click it
      renameButton.click();
    }, 100);

    // Return the id of the node so that the caller can use it
    return id;
  }, []);
}

/**
 * Get manifold and metaculus nodes
 */
export function useLiveMarketNodes() {
  return useStorage((state) => state.marketNodes);
}

export type LiveMarketNodes = ReturnType<typeof useLiveMarketNodes>;
export type LiveMarketNode = LiveMarketNodes extends ReadonlyMap<any, infer V>
  ? V
  : never;

/**
 * Add a Market Node at the given position
 */
export function useAddMarketNodeAtPosition() {
  return useMutation(
    (
      { storage },
      position: { x: number; y: number; marketType: "Manifold" | "Metaculus" }
    ) => {
      let nodes = storage.get("marketNodes");

      // Create marketNodes if it doesn't exist
      if (!nodes) {
        nodes = new LiveMap([]);
        storage.set("marketNodes", nodes);
      }

      const node = new LiveObject({
        x: position.x - customNodeWidth / 2,
        y: position.y - 50,
        marketType: position.marketType,
        link: "",
      });

      const id = nanoid();

      nodes.set(id, node);

      return id;
    },
    []
  );
}
