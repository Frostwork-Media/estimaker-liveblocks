import { VercelApiHandler } from "@vercel/node";
import { nanoid } from "nanoid";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { ProjectMetadata, version } from "shared";
import { userFromSession } from "./_auth";

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user) {
    res.status(401).end("Unauthorized");
    return;
  }

  const id = `room-${nanoid()}`;

  const metadata: ProjectMetadata = {
    version: version.toString(),
    name: "Untitled",
    public: "false",
    slug: "",
    ownerId: user.id,
    ownerEmail: email,
  };

  const body = {
    id,
    defaultAccesses: [],
    metadata,
    usersAccesses: {
      [email]: ["room:write"],
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

  const roomJson = await room.json();

  if (roomJson.error) {
    res.status(500).end(roomJson.error);
    return;
  }

  res.status(200).json(roomJson);
};

export default handler;
