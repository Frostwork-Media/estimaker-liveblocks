import { VercelApiHandler } from "@vercel/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";

const handler: VercelApiHandler = async (req, res) => {
  const roomId = req.query.id as string;
  if (!roomId) {
    res.status(400).end("Missing id");
    return;
  }

  // fetch room
  const room = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      res.status(500).end("Error fetching room");
      return;
    });

  if (!room) {
    res.status(404).end("Room not found");
    return;
  }

  res.status(200).json(room.metadata);
};

export default handler;
