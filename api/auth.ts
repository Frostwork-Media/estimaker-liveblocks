import { authorize } from "@liveblocks/node";
import { VercelApiHandler } from "@vercel/node";
import { config } from "dotenv";
import path from "path";
import { verify } from "jsonwebtoken";
import { clerkClient } from "@clerk/clerk-sdk-node";

config({ path: path.join(__dirname, "..", "app", ".env") });

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

const auth: VercelApiHandler = async (req, res) => {
  if (!API_KEY || !JWT_PUBLIC_KEY) {
    res.status(403).end();
    return;
  }

  // lookup clerk public key
  const splitPem = process.env.JWT_PUBLIC_KEY.match(/.{1,64}/g);
  if (!splitPem) {
    throw new Error("Invalid JWT_PUBLIC_KEY");
  }
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    splitPem.join("\n") +
    "\n-----END PUBLIC KEY-----";

  // read the __session cookie
  const session = req.cookies.__session;

  // if the session is undefined, return null
  if (!session) {
    return null;
  }

  // verify the JWT
  const decoded = verify(session, publicKey);

  if (typeof decoded === "string") {
    return null;
  }

  // check exp and nbf
  if (decoded.exp && decoded.nbf) {
    const now = Math.floor(Date.now() / 1000);
    if (now < decoded.nbf || now > decoded.exp) {
      return null;
    }
  }

  const userId = decoded.sub;
  if (!userId) {
    return null;
  }

  const user = await clerkClient.users.getUser(userId);

  const response = await authorize({
    room: req.body.room,
    secret: API_KEY,
    userId: userId,
    userInfo: {
      name: user.firstName,
      picture: user.profileImageUrl,
    },
  });
  res.status(response.status).end(response.body);
  return;
};

export default auth;
