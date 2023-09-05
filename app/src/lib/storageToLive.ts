import { Storage } from "shared";

/**
 * Takse the response from /rooms/:roomId/storage
 * and converts to be more similar to the RoomProvider-dependent hooks.
 *
 * That includes:
 * - expanding any data properties
 * - convert objects to maps
 *
 * Note: Currently Unused!
 */
export function storageToLive(data: Storage) {
  console.log("storageToLive");
  console.log(data);
}
