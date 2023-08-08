import { VercelApiHandler } from "@vercel/node";
import { nanoid } from "nanoid";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";

const handler: VercelApiHandler = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    res.status(400).end("Missing userId");
    return;
  }

  console.log(userId);
  console.log(userId.length);

  const id = `room-${nanoid()}`;

  const body = {
    id,
    defaultAccesses: [],
    metadata: {},
    usersAccesses: {
      [userId]: ["room:write"],
    },
    groupsAccesses: {},
  };

  const room = await fetch("https://api.liveblocks.io/v2/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log("room", room);

  const roomJson = await room.json();

  if (roomJson.error) {
    res.status(500).end(roomJson.error);
    return;
  }

  res.status(200).json(roomJson);
};

export default handler;
