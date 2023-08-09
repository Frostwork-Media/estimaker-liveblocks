import { useUser } from "@clerk/clerk-react";

/** Gets the email for the current user */
export function useLiveblocksUserId() {
  const user = useUser();
  return user.user?.emailAddresses[0]?.emailAddress;
}
