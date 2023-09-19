import { jsonToLive } from "./jsonToLive";
import { MetaforecastNode, SquiggleNode } from "./nodes";

export const SCHEMA_VERSION = "2";

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

export const INITIAL_STORAGE_RAW: Schema = {
  title: "Untitled",
  squiggle: {},
  metaforecast: {},
  suggestedEdges: {},
};

export const INITIAL_STORAGE = jsonToLive(INITIAL_STORAGE_RAW);

export type Storage = typeof INITIAL_STORAGE;
