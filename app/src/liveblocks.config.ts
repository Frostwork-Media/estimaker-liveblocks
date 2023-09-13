import { createClient, LiveObject, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { ManifoldNode, MetaculusNode, SquiggleNode } from "shared";

export const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16,
});

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
type Presence = {
  // cursor: { x: number, y: number } | null,
  // ...
};

export type LiveSquiggleNode = LiveObject<SquiggleNode>;
export type LiveManifoldNode = LiveObject<ManifoldNode>;
export type LiveMetaculusNode = LiveObject<MetaculusNode>;

type Storage = {
  title: string;
  squiggle: LiveMap<string, LiveSquiggleNode>;
  manifold: LiveMap<string, LiveManifoldNode>;
  metaculus: LiveMap<string, LiveMetaculusNode>;
  suggestedEdges: LiveMap<string, string[]>;
};

// UserMeta represents static/readonly metadata on each User, as provided by
// your own custom auth backend (if used). Useful for data that will not change
// during a session, like a User's name or avatar.
export type UserMeta = {
  id: string;
  info: {
    name: string;
    picture: string;
  };
};

// Optionally, the type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
// type RoomEvent = {};

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useSelf,
    useStorage,
    useMutation,
    useStatus,
    useRoom,
  },
} = createRoomContext<
  Presence,
  Storage,
  UserMeta
  /* RoomEvent */
>(client);
