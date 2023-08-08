import { authorize } from "@liveblocks/node";
import { VercelApiHandler } from "@vercel/node";

import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { userFromSession } from "./_userFromSession";

const auth: VercelApiHandler = async (req, res) => {
  const user = await userFromSession(req);

  if (!user) {
    res.status(401).end("Unauthorized");
    return;
  }

  const response = await authorize({
    room: req.body.room,
    secret: LIVEBLOCKS_SECRET_KEY,
    userId: user.id,
    userInfo: {
      name: user.firstName,
      picture: user.profileImageUrl,
    },
  });

  // Return the Result
  res.status(response.status).end(response.body);
  return;
};

export default auth;
