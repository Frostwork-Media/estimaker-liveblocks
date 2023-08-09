import { liveblocks } from "./_liveblocks";
import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "./_userFromSession";

const handler: VercelApiHandler = async (req, res) => {
  // get user based on session
  const user = await userFromSession(req);
  const emailAddress = user.emailAddresses[0]?.emailAddress;

  if (!user || !emailAddress) {
    res.status(401).end("Unauthorized");
    return;
  }

  // In Liveblocks we will identify by clerk Id but store
  // email and name in the user info
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: emailAddress,
      groupIds: [],
    },
    {
      userInfo: {
        name: user.firstName,
        picture: user.imageUrl,
      },
    }
  );

  // Return the Result
  res.status(status).end(body);
  return;
};

export default handler;
