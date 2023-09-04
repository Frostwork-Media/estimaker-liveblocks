import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "..", "app", ".env") });

if (!process.env.LIVEBLOCKS_SECRET_KEY)
  throw new Error("Missing LIVEBLOCKS_SECRET_KEY");
const LIVEBLOCKS_SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

if (!process.env.JWT_PUBLIC_KEY) throw new Error("Missing JWT_PUBLIC_KEY");
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

if (!process.env.METACULUS_API_KEY)
  throw new Error("Missing METACULUS_API_KEY");
const METACULUS_API_KEY = process.env.METACULUS_API_KEY;

export { LIVEBLOCKS_SECRET_KEY, JWT_PUBLIC_KEY, METACULUS_API_KEY };
