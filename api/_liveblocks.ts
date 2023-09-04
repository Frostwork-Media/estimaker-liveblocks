import { Liveblocks } from "@liveblocks/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { ProjectMetadata } from "shared";
import { Project } from "./_types";

export const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const params = new URLSearchParams();
  params.append("metadata.slug", slug);
  let response = await fetch(
    `https://api.liveblocks.io/v2/rooms?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });

  if (!response || !response.data.length) {
    return null;
  }

  return response.data[0];
}

/**
 * User the room id to get the storage
 * by sending a get request to https://api.liveblocks.io/v2/rooms/{roomId}/storage
 */
export async function getProjectStorage(id: string) {
  const response = await fetch(
    `https://api.liveblocks.io/v2/rooms/${id}/storage`,
    {
      headers: {
        Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });

  return response;
}
