import { Schema } from "./src/schema";
import { ProjectMetadata } from "./src/types";

export * from "./src/nodes";
export * from "./src/schema";
export * from "./src/jsonToLive";
export * from "./src/jsonToLson";
export * from "./src/types";
export * from "./src/migrate";
export * from "./src/metaforecast";

export interface PublicProject {
  metadata: ProjectMetadata;
  storage: Schema;
}

/**
 * This is the unsafeMetadata stored on the clerk user
 */
export type ClerkUserMetadata = { username: string };
