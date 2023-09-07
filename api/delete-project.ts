import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "./_userFromSession";
import { deleteProject, getProjectById } from "./_liveblocks";

const handler: VercelApiHandler = async (req, res) => {
  if (!req.method || req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const roomId = req.body.roomId;
  if (!roomId) {
    res.status(400).json({ error: "Missing roomId" });
    return;
  }

  const [user, email] = await userFromSession(req);
  if (!user) {
    res.status(401).json({ error: "Error deleting room" });
    return;
  }

  const room = await getProjectById(roomId);
  if (!room) {
    res.status(500).json({ error: "Error deleting room" });
    return;
  }

  const hasAccess =
    email in room.usersAccesses
      ? room.usersAccesses[email].includes("room:write")
      : false;

  if (!hasAccess) {
    res.status(401).json({ error: "Error deleting room" });
    return;
  }

  const response = await deleteProject(roomId);
  if (!response.ok) {
    res.status(500).json({ error: "Error deleting room" });
    return;
  }

  res.status(200).json({ success: true });
  return;
};

export default handler;
