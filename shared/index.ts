export type ProjectMetadata = {
  name: string;
  public: "true" | "false";
  slug: string;
};

/**
 * This is the unsafeMetadata stored on the clerk user
 */
export type UserMetadata = { username: string };

export interface PublicProject {
  metadata: ProjectMetadata;
  storage: SimplifiedStorage;
}

export interface Storage {
  liveblocksType: string;
  data: StorageData;
}

export interface SimplifiedStorage {
  title: string;
  nodes: { [key: string]: StaticNodeData };
  suggestedEdges: { [key: string]: string[] };
}

export interface StorageData {
  title: string;
  nodes: Nodes;
  suggestedEdges: SuggestedEdges;
}

export interface Nodes {
  liveblocksType: string;
  data: { [key: string]: StaticNode };
}

export interface StaticNode {
  liveblocksType: string;
  data: StaticNodeData;
}

export interface StaticNodeData {
  content: string;
  variableName: string;
  x: number;
  y: number;
  value: string;
  color: string;
  showing?: "graph";
  manifold?: string;
  metaculus?: string;
}

export interface SuggestedEdges {
  liveblocksType: string;
  data: { [key: string]: string[] };
}
