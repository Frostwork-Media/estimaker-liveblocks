import { VercelApiHandler } from "@vercel/node";
import { LIVEBLOCKS_SECRET_KEY } from "../_config";
import { updateProjectMetadata } from "../_liveblocks";

const handler: VercelApiHandler = async (req, res) => {
  const id = req.body.id;
  const slug = req.body.slug;
  if (!id || !slug) {
    res.status(400).end("Missing parameters");
    return;
  }

  // Check if that slug exists first
  const found = await fetch(
    `https://api.liveblocks.io/v2/rooms?metadata.slug=${slug}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  if (found.data.length > 0) {
    res.status(400).json({ error: "Slug already exists" });
    return;
  }

  // Get the full metdata
  const result = await updateProjectMetadata(id, { slug });

  if (!result) {
    res.status(500).json({ error: "Error updating metadata" });
    return;
  }

  res.status(200).json(result);
  return;
};

export default handler;
