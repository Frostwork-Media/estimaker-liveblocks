import { VercelApiHandler } from "@vercel/node";
import { userFromSession, userOwnsRoom } from "./_auth";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { getProjectById } from "./_liveblocks";

const handler: VercelApiHandler = async (req, res) => {
  const userToAdd = req.body.userToAdd;
  if (!userToAdd) {
    res.status(400).end("Missing userToAdd");
    return;
  }

  const roomId = req.body.roomId;
  if (!roomId) {
    res.status(400).end("Missing roomId");
    return;
  }

  // get the user from the session
  const [user, email] = await userFromSession(req);
  if (!user) {
    res.status(401).end("Unauthorized");
    return;
  }

  // Load the room from liveblocks rest api
  const room = await getProjectById(roomId);

  if (!room) {
    res.status(500).end("Error loading room");
    return;
  }

  // Make sure the user is allowed to add users to the room
  const isOwner = userOwnsRoom(room, user.id, email);
  if (!isOwner) {
    res.status(401).end("Unauthorized");
    return;
  }

  // Update the room
  const usersAccesses = { ...room.usersAccesses, [userToAdd]: ["room:write"] };
  let response = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usersAccesses }),
  });

  if (!response.ok) {
    res.status(500).end("Error updating room");
    return;
  }

  res.status(200).end("OK");
};

export default handler;
