import { jsonToLive } from "./jsonToLive";
import { ManifoldNode, MetaculusNode, SquiggleNode } from "./nodes";

export const SCHEMA_VERSION = "1";

export type Schema = {
  title: string;
  squiggle: Record<string, SquiggleNode>;
  manifold: Record<string, ManifoldNode>;
  metaculus: Record<string, MetaculusNode>;
  suggestedEdges: Record<string, string[]>;
};

export const INITIAL_STORAGE_RAW: Schema = {
  title: "Untitled",
  squiggle: {},
  manifold: {},
  metaculus: {},
  suggestedEdges: {},
};

export const INITIAL_STORAGE = jsonToLive(INITIAL_STORAGE_RAW);

export type Storage = typeof INITIAL_STORAGE;
