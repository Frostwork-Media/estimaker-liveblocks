import { VercelApiHandler } from "@vercel/node";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { userFromSession } from "../_userFromSession";
import { UserMetadata } from "shared";

const handler: VercelApiHandler = async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== "string") {
    res.status(400).json({
      error: "Missing username",
    });
    return;
  }

  const [user] = await userFromSession(req);

  if (!user) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  const result = await clerkClient.users.updateUserMetadata(user.id, {
    unsafeMetadata: {
      username,
    },
  });

  res.status(200).json(result.unsafeMetadata as UserMetadata);
  return;
};

export default handler;
