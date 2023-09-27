import { jsonToLive } from "./jsonToLive";
import { MetaforecastNode, SquiggleNode } from "./nodes";
import { from } from "future-proof";

export type Schema = {
  title: string;
  /**
   * Stores Squiggle Nodes
   */
  squiggle: Record<string, SquiggleNode>;
  /**
   * Stores Metaforecast Nodes
   */
  metaforecast: Record<string, MetaforecastNode>;
  suggestedEdges: Record<string, string[]>;
};

export const initialStorageRaw: Schema = {
  title: "Untitled",
  squiggle: {},
  metaforecast: {},
  suggestedEdges: {},
};

export const initialStorage = jsonToLive(initialStorageRaw);

export type Storage = typeof initialStorage;

export const { migrate, version } = from({
  title: "Untitled",
  squiggle: {},
  metaforecast: {},
  suggestedEdges: {},
}).init(initialStorageRaw);
