import { Liveblocks } from "@liveblocks/node";
import { LIVEBLOCKS_SECRET_KEY } from "./_config";
import { ProjectMetadata, Room, Schema } from "shared";

export const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});

export async function getProjectBySlug(slug: string): Promise<Room | null> {
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
 * Get room by id
 */
export async function getProjectById(id: string): Promise<Room | null> {
  const response = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });

  if ("error" in response) {
    return null;
  }

  return response;
}

/**
 * Delete a project given the id
 */
export function deleteProject(id: string) {
  return fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });
}

/**
 * User the room id to get the storage
 * by sending a get request to https://api.liveblocks.io/v2/rooms/{roomId}/storage
 */
export async function getProjectStorage(id: string): Promise<Schema | null> {
  const response = await fetch(
    `https://api.liveblocks.io/v2/rooms/${id}/storage?format=json`,
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

export async function updateProjectMetadata(
  id: string,
  update: Partial<ProjectMetadata>,
  initial?: Partial<ProjectMetadata>
): Promise<ProjectMetadata | null> {
  let baseMetadata = initial;
  if (!baseMetadata) {
    const project = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (!project) return null;

    baseMetadata = project.metadata;
  }

  const metadata = {
    ...baseMetadata,
    ...update,
  };

  const room = await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metadata,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });

  return room.metadata;
}

export async function setStorageById(id: string, data: object) {
  return fetch(`https://api.liveblocks.io/v2/rooms/${id}/storage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function updateRoomById(id: string, data: Partial<Room>) {
  return fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function deleteStorageById(id: string) {
  return fetch(`https://api.liveblocks.io/v2/rooms/${id}/storage`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
    },
  });
}
