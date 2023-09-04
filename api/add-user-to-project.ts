import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "./_userFromSession";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { Project } from "./_types";

const handler: VercelApiHandler = async (req, res) => {
  const roomId = req.body.roomId;
  if (!roomId) {
    res.status(400).end("Missing roomId");
    return;
  }
  const userToAdd = req.body.userToAdd;
  if (!userToAdd) {
    res.status(400).end("Missing userToAdd");
    return;
  }

  // get the user from the session
  const user = await userFromSession(req);
  if (!user) {
    res.status(401).end("Unauthorized");
    return;
  }

  const emailAddress = user.emailAddresses[0]?.emailAddress;

  if (!emailAddress) {
    res.status(401).end("Unauthorized");
    return;
  }

  // Load the room from liveblocks rest api
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

  const room = (await response.json()) as Project;

  // Make sure the user is allowed to add users to the room
  const hasAccess =
    emailAddress in room.usersAccesses
      ? room.usersAccesses[emailAddress].includes("room:write")
      : false;
  if (!hasAccess) {
    res.status(401).end("Unauthorized");
    return;
  }

  // Update the room
  const usersAccesses = { ...room.usersAccesses, [userToAdd]: ["room:write"] };
  response = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}`, {
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
