import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Storage, UserMeta } from "shared";

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

type RoomEvent = {
  type: "SCHEMA_CHANGED";
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
    useEventListener,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
