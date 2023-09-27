/**
 * This is the unsafeMetadata stored on the clerk user
 */
export type UserInfo = {
  name: string;
  picture: string;
};

// UserMeta represents static/readonly metadata on each User, as provided by
// your own custom auth backend (if used). Useful for data that will not change
// during a session, like a User's name or avatar.
export type UserMeta = {
  id: string;
  info: UserInfo;
};

export type ProjectMetadata = {
  version: string;
  name: string;
  public: "true" | "false";
  slug: string;
  /**
   * This is the clerk Id of the user that created the project
   */
  ownerId: string;
  ownerEmail: string;
};

export type Room = {
  type: "room";
  id: string;
  metadata: ProjectMetadata;
  defaultAccesses: RoomAccess[];
  groupsAccesses: RoomAccesses;
  usersAccesses: RoomAccesses;
  draft: "yes" | "no";
  createdAt?: string;
  lastConnectionAt: string;
};

export enum RoomAccess {
  RoomWrite = "room:write",
  RoomRead = "room:read",
  RoomPresenceWrite = "room:presence:write",
}

export enum RoomAccessLevels {
  USER = "user",
  GROUP = "group",
  DEFAULT = "default",
}

export type RoomMetadata = Record<string, string | string[]>;

export type RoomAccesses = Record<string, RoomAccess[] | null>;

export type RoomActiveUser = {
  type: "user";
  id: string;
  connectionId: number;
  info: UserInfo;
};
