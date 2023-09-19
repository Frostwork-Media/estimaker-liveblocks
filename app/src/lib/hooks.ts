import { useMutation, useRoom } from "@/liveblocks.config";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ProjectMetadata, ClerkUserMetadata, NodeTypes } from "shared";
import { useClientStore } from "./useClientStore";
import { isEditing } from "./helpers";
import { useReactFlow } from "reactflow";
import { useGraphStore } from "./useGraphStore";

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

/**
 * Returns the Clerk user metadata
 */
export function useUserMetadata() {
  return useQuery<ClerkUserMetadata>(
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
 * Listens for certain keyboard events on the window
 *
 * When the mouse is over the wrapper, if the user presses the / key, and the user is not typing in an input, alert "hi"
 */
export function useKeyboardListeners() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const deleteNode = useMutation(
    ({ storage }, selected: string[]) => {
      for (const id of selected) {
        const node = reactFlowInstance.getNode(id);
        if (!node) continue;
        const nodeType = node.type as NodeTypes;
        storage.get(nodeType).delete(id);
      }
    },
    [reactFlowInstance]
  );
  useEffect(() => {
    if (!wrapperRef.current) return;
    function onMouseMouve(e: MouseEvent) {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !e.repeat) {
        if (isEditing()) return;

        useClientStore.setState({
          floatingPopoverOpen: true,
          floatingPopoverMousePosition: mousePosition.current,
        });
      }

      // Delete selected nodes when the user presses the backspace key
      if (e.key === "Backspace") {
        const selected = useGraphStore.getState().selected;
        if (selected.length && window.confirm("Are you sure?")) {
          deleteNode(selected);
          useGraphStore.setState({ selected: [] });
        }
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
