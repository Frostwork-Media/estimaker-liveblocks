import { Liveblocks } from "@liveblocks/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";

export const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});
