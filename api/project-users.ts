import { VercelApiHandler } from "@vercel/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";

const handler: VercelApiHandler = async (req, res) => {
  const roomId = req.query.roomId as string;
  if (!roomId) {
    res.status(400).end("Missing roomId");
    return;
  }

  // load room
  let response = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    res.status(500).end("Error loading room");
    return;
  }

  const room = await response.json();

  res.status(200).json(Object.keys(room.usersAccesses));
};

export default handler;
