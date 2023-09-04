import { ProjectMetadata } from "shared";

export interface Project {
  type: string;
  id: string;
  lastConnectionAt: string;
  createdAt: string;
  metadata: ProjectMetadata;
  defaultAccesses: string[];
  groupsAccesses: Record<string, string[]>;
  usersAccesses: Record<string, string[]>;
}
