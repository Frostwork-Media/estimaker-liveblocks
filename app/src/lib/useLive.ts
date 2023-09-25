import { useMutation } from "@/liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { customNodeWidth } from "./constants";
import { nanoid } from "nanoid";
import { SquiggleNode, toLive } from "shared";

// export type LiveNodes = ReturnType<typeof useLiveNodes>;
// export type LiveNode = LiveNodes extends ReadonlyMap<any, infer V> ? V : never;

// export type LiveSuggestedEdges = ReturnType<typeof useLiveSuggestedEdges>;

export function useLiveAddSuggestedEdge() {
  return useMutation(({ storage }, dependency: [string, string]) => {
    storage
      .get("suggestedEdges")
      .set(dependency.join("-"), new LiveList<string>(dependency));
  }, []);
}

export function useAddSquiggleNodeAtPosition() {
  return useMutation(
    (
      { storage },
      {
        x,
        y,
        initialValue = "",
      }: { x: number; y: number; initialValue?: string }
    ) => {
      const nodes = storage.get("squiggle");
      const size = Object.keys(nodes.toObject()).length;
      const baseNode: SquiggleNode = {
        nodeType: "squiggle",
        content: "",
        variableName: `var${size + 1}`,
        // We move the x position back by half of the node width, so it's centered
        x: x - customNodeWidth / 2,
        // Not sure
        y: y - 50,
        value: initialValue,
        overrides: {},
      };
      const node = toLive(baseNode);
      const id = nanoid();
      nodes.set(id, node);

      // Return the id of the node so that the caller can use it
      return id;
    },
    []
  );
}
