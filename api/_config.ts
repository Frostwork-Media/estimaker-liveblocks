import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "..", "app", ".env") });

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;
if (!API_KEY) throw new Error("Missing LIVEBLOCKS_SECRET_KEY");

const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;
if (!JWT_PUBLIC_KEY) throw new Error("Missing JWT_PUBLIC_KEY");

export { API_KEY, JWT_PUBLIC_KEY };
