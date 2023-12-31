import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_auth";

/**
 * Get user metadata from clerk
 */
const handler: VercelApiHandler = async (req, res) => {
  const [user] = await userFromSession(req);
  if (!user) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }
  res.status(200).json(user.unsafeMetadata);
};

export default handler;
