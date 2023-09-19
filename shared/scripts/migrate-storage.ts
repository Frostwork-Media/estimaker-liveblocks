import { Room } from "../src/types";

if (!process.env.LIVEBLOCKS_SK) {
  throw new Error("Missing LIVEBLOCKS_SK");
}

if (!process.env.SCHEMA_VERSION_CHANGED) {
  throw new Error("Missing SCHEMA_VERSION_CHANGED");
}

// If the version is not the most recent schema version
if (process.env.SCHEMA_VERSION_CHANGED.trim() === "true") {
  // Broadcast event to a room, tell them to refresh for the latest version

  /**
   * If no one is in the room, nothing will happen.
   * If there is someone in the room we will block the screen and make them refresh,
   * and that will migrate the data and fix the problem.
   */

  console.log("The schema version has changed, so we need to migrate the data");

  (async () => {
    // loop over rooms
    const limit = 100;
    let nextPage = `/v2/rooms?limit=${limit}`;
    let rooms: Room[] = [];
    while (nextPage) {
      const response = await fetch(`https://api.liveblocks.io${nextPage}`, {
        headers: {
          Authorization: `Bearer ${process.env.LIVEBLOCKS_SK}`,
        },
      });
      const json = await response.json();
      rooms = rooms.concat(json.data);
      nextPage = json.nextPage;

      console.log(`Found ${rooms.length} rooms so far`);

      // Throttle requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    for (const { id } of rooms) {
      // Broadcast a SCHEMA_CHANGED event to the room
      // using https://api.liveblocks.io/v2/rooms/{roomId}/broadcast_event
      console.log(`Broadcasting SCHEMA_CHANGED event to room ${id}`);
      await fetch(`https://api.liveblocks.io/v2/rooms/${id}/broadcast_event`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIVEBLOCKS_SK}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "SCHEMA_CHANGED",
        }),
      });

      // throttle requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  })();
}
