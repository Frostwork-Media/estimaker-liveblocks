export interface Room {
  type: string;
  id: string;
  lastConnectionAt: string;
  createdAt: string;
  metadata: any;
  defaultAccesses: string[];
  groupsAccesses: Record<string, string[]>;
  usersAccesses: Record<string, string[]>;
}
