import { VercelApiHandler } from "@vercel/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";

const handler: VercelApiHandler = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).end("Missing id");
    return;
  }

  // get the room
  const room = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  if (!room || room.error) {
    res.status(404).end("Room not found");
    return;
  }

  const metadata = { ...room.metadata, public: "false" };

  // update the room
  const updatedRoom = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata }),
  }).then((res) => res.json());

  if (!updatedRoom || updatedRoom.error) {
    res.status(500).end("Error updating room");
    return;
  }

  res.status(200).json(metadata);
};

export default handler;
