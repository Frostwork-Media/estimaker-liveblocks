import { useRoom } from "@/liveblocks.config";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ProjectMetadata, UserMetadata } from "shared";
import { useClientStore } from "./useClientStore";

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

/**
 * Enables the forwardSlash listener
 *
 * When the mouse is over the wrapper, if the user presses the / key, and the user is not typing in an input, alert "hi"
 */
export function useForwardSlashListener() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapperRef.current) return;
    function onMouseMouve(e: MouseEvent) {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !e.repeat) {
        if (document.activeElement?.tagName === "INPUT") return;
        if (document.activeElement?.tagName === "TEXTAREA") return;
        if (document.activeElement?.tagName === "SELECT") return;
        if (document.activeElement?.tagName === "BUTTON") return;
        if (document.activeElement?.tagName === "A") return;
        if (document.activeElement?.tagName === "LABEL") return;
        if (document.activeElement?.tagName === "SUMMARY") return;
        if (document.activeElement?.tagName === "DETAILS") return;
        if (document.activeElement?.tagName === "TEXTAREA") return;
        if (document.activeElement?.tagName === "OPTION") return;
        if (document.activeElement?.tagName === "OPTGROUP") return;
        if (document.activeElement?.tagName === "PROGRESS") return;
        if (document.activeElement?.tagName === "METER") return;
        if (document.activeElement?.tagName === "OUTPUT") return;
        if (document.activeElement?.tagName === "SELECT") return;
        if (document.activeElement?.tagName === "TEXTAREA") return;

        useClientStore.setState({
          floatingPopoverOpen: true,
          floatingPopoverMousePosition: mousePosition.current,
        });
      }
    }

    const wrapper = wrapperRef.current;
    function onMouseEnter() {
      window.addEventListener("keydown", onKeyDown);
    }
    function onMouseLeave() {
      window.removeEventListener("keydown", onKeyDown);
    }
    wrapper.addEventListener("mouseenter", onMouseEnter);
    wrapper.addEventListener("mouseleave", onMouseLeave);
    wrapper.addEventListener("mousemove", onMouseMouve);
    return () => {
      wrapper.removeEventListener("mouseenter", onMouseEnter);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      wrapper.removeEventListener("mousemove", onMouseMouve);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return wrapperRef;
}
