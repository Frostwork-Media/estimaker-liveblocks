/**
 * Converts a collaborators email into a suffix we can use at the end of a variabel to store
 * their override.
 *
 * Going to pick the first 6 characters of the email, and replace any non-alphanumeric characters
 */
export function emailToVarSuffix(email: string) {
  return email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);
}
