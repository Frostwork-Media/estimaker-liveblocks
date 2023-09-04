import { VercelApiHandler } from "@vercel/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { ProjectMetadata } from "shared";

const handler: VercelApiHandler = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).end("Missing id");
    return;
  }

  // Loop Up the room
  const room = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      res.status(500).end("Error fetching room");
      return;
    });

  if (!room) {
    res.status(404).end("Room not found");
    return;
  }

  const metadata = room.metadata as Partial<ProjectMetadata>;

  let isPublicReady = true;

  // If it doesn't have a slug
  // Slugify the title
  let slug = metadata.slug || "";
  if (!slug) {
    isPublicReady = false;
    const baseName = slugify(metadata.name || "Untitled Project");
    let i = 0,
      nameIsValid = false;
    while (!nameIsValid) {
      const test = i === 0 ? baseName : `${baseName}-${i}`;

      // Check if the slug is taken
      // in order to test metadata querying try listing all rooms with a specific title
      const found = await fetch(
        `https://api.liveblocks.io/v2/rooms?metadata.slug=${test}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          res.status(500).end("Error fetching room");
          return;
        });

      if (found.error) {
        res.status(500).end("Error fetching room");
        return;
      }

      if (found.data.length === 0) {
        nameIsValid = true;
        slug = test;
      }

      i++;
    }
  }

  // If it's not public, make it public
  let isPublic: "true" | "false" = metadata.public || "false";
  if (isPublic === "false") {
    isPublicReady = false;
    isPublic = "true";
  }

  // Update the room with the new slug and being public
  if (!isPublicReady) {
    const room = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata: {
          ...metadata,
          slug,
          public: isPublic,
        },
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        res.status(500).end("Error fetching room");
        return;
      });

    if (!room) {
      res.status(500).end("Error updating room");
      return;
    }

    res.status(200).json(room.metadata);
  } else {
    res.status(200).json(room.metadata);
  }
};

export default handler;

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
