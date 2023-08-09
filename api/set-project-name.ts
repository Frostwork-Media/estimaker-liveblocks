import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "./_userFromSession";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { Room } from "./_types";

interface RequestBody {
  roomId: string;
  newName: string;
}

const setProjectName: VercelApiHandler = async (req, res) => {
  const { roomId, newName } = req.body as RequestBody;

  // Get the user from the session
  const user = await userFromSession(req);
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // Load the room and check if the user has access
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

  const room = (await response.json()) as Room;

  // Make sure the user is allowed to add users to the room
  const hasAccess =
    userEmail in room.usersAccesses
      ? room.usersAccesses[userEmail].includes("room:write")
      : false;

  if (!hasAccess) {
    res.status(401).end("Unauthorized");
    return;
  }

  // Update the room metadata with the new name
  const metadata = { ...room.metadata, name: newName };

  // Update the room with the new metadata
  response = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata }),
  });

  let updatedRoom = (await response.json()) as Room;

  console.log({ updatedRoom });

  // Return the updated room
  res.status(200).json(updatedRoom);
};

export default setProjectName;
