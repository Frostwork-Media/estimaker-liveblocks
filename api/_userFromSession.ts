import { VercelRequest } from "@vercel/node";
import { JWT_PUBLIC_KEY } from "./_config";
import { verify } from "jsonwebtoken";
import { clerkClient } from "@clerk/clerk-sdk-node";

export function userFromSession(req: VercelRequest) {
  // lookup clerk public key
  const splitPem = JWT_PUBLIC_KEY.match(/.{1,64}/g);
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

  return clerkClient.users.getUser(userId);
}
