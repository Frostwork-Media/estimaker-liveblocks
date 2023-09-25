import { ProjectMetadata } from "shared";

/**
 * This function returns an integer for any collaborator.
 * The owner will always be 0.
 * Then collaborators will be assigned an integer based the order they were added.
 *
 * This function must work statically for highlighting in public graphs.
 */
export function getFixedUserIndex(email: string, meta: ProjectMetadata) {
  console.log(email, meta);
}
