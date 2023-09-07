import { useRoom } from "@/liveblocks.config";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ProjectMetadata, UserMetadata } from "shared";

/** Gets the email for the current user */
export function useLiveblocksUserId() {
  const user = useUser();
  return user.user?.emailAddresses[0]?.emailAddress;
}

export function useRoomMetadata(roomId: string) {
  return useQuery<ProjectMetadata>(
    ["metadata", roomId],
    async () => {
      const res = await fetch(`/api/room-metadata?id=${roomId}`);
      return res.json();
    },
    {
      enabled: !!roomId,
      suspense: true,
    }
  );
}

export function useUserMetadata() {
  return useQuery<UserMetadata>(
    ["user-metadata"],
    async () => {
      const res = await fetch("/api/user/meta");
      return res.json();
    },
    {
      suspense: true,
    }
  );
}

/**
 * Requires room context
 */
export function useIsOwner() {
  const room = useRoom();
  const metadata = useRoomMetadata(room.id);
  const { user } = useUser();
  return user && metadata.data && metadata.data.ownerId === user.id;
}
