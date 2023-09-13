import { ManifoldNode, MetaculusNode, SquiggleNode } from "./nodes";
export * from "./nodes";

export type ProjectMetadata = {
  name: string;
  public: "true" | "false";
  slug: string;
  /**
   * This is the clerk Id of the user that created the project
   */
  ownerId: string;
};

/**
 * This is the unsafeMetadata stored on the clerk user
 */
export type UserMetadata = { username: string };

export interface PublicProject {
  metadata: ProjectMetadata;
  storage: SimplifiedStorage;
}

export interface SimplifiedStorage {
  title: string;
  squiggle: { [key: string]: SquiggleNode };
  manifold: { [key: string]: ManifoldNode };
  metaculus: { [key: string]: MetaculusNode };
  suggestedEdges: { [key: string]: string[] };
}
