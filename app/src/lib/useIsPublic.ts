import { PublicRoomContext } from "@/components/PublicRoomProvider";
import { useContext } from "react";

/**
 * This hook is used to translate between my useLive functions and the
 * static versions
 */
export function useIsPublic() {
  return !!useContext(PublicRoomContext).isPublic;
}
