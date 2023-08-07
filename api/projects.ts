import { VercelApiHandler } from "@vercel/node";
import { API_KEY } from "./_config";

const handler: VercelApiHandler = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) throw new Error("Missing userId");
    const response = await fetch("https://api.liveblocks.io/v2/rooms", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!("data" in data)) throw new Error("Missing data");
    res.status(200).json(data.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
