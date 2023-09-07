import { VercelRequest } from "@vercel/node";
import { JWT_PUBLIC_KEY } from "./_config";
import { verify } from "jsonwebtoken";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function userFromSession(req: VercelRequest) {
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
    return [null, null] as const;
  }

  // verify the JWT
  const decoded = verify(session, publicKey);

  if (typeof decoded === "string") {
    return [null, null] as const;
  }

  // check exp and nbf
  if (decoded.exp && decoded.nbf) {
    const now = Math.floor(Date.now() / 1000);
    if (now < decoded.nbf || now > decoded.exp) {
      return [null, null] as const;
    }
  }

  const userId = decoded.sub;
  if (!userId) {
    return [null, null] as const;
  }

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  if (!user || !email) return [null, null] as const;

  return [user, email] as const;
}
