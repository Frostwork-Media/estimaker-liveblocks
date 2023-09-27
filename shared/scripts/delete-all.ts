/**
 * WARNING! THIS WILL DELETE ALL DATA IN THE DATABASE!
 *
 * It's only meant be used during development. To prevent accidental use, you must
 * also have the chorus lyrics to 1995's "Total Eclipse of the Heart" on the environment.
 */

import { Room } from "../";

if (!process.env.TOTAL_ECLIPSE_OF_THE_HEART) {
  process.exit(0);
}

if (
  process.env.TOTAL_ECLIPSE_OF_THE_HEART !==
  "And I need you now tonight And I need you more than ever And if you only hold me tight We'll be holding on forever And we'll only be making it right 'Cause we'll never be wrong Together we can take it to the end of the line Your love is like a shadow on me all of the time (All of the time) I don't know what to do and I'm always in the dark We're living in a powder keg and giving off sparks I really need you tonight Forever's gonna start tonight Forever's gonna start tonight"
) {
  process.exit(0);
}

if (!process.env.LIVEBLOCKS_SK) {
  throw new Error("Missing LIVEBLOCKS_SK");
}

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
    console.log(`Deleting room ${id}`);
    await fetch(`https://api.liveblocks.io/v2/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.LIVEBLOCKS_SK}`,
      },
    });

    // throttle requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
})();
