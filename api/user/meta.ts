import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "../_userFromSession";

/**
 * Get user metadata
 */
const handler: VercelApiHandler = async (req, res) => {
  const user = await userFromSession(req);
  if (!user) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }
  res.status(200).json(user.unsafeMetadata);
};

export default handler;
