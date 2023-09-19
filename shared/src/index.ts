import { Schema } from "./schema";
import { ProjectMetadata } from "./types";

export * from "./nodes";
export * from "./schema";
export * from "./jsonToLive";
export * from "./jsonToLson";
export * from "./types";
export * from "./migrate";

export interface PublicProject {
  metadata: ProjectMetadata;
  storage: Schema;
}

/**
 * This is the unsafeMetadata stored on the clerk user
 */
export type ClerkUserMetadata = { username: string };
