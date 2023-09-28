import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { create } from "zustand";

export function useCollaborators(roomId?: string) {
  return useQuery<string[]>(
    ["project-users", roomId],
    async () => {
      if (!roomId) return [];

      const collaborators = (await fetch(
        `/api/project-users?roomId=${roomId}`
      ).then((res) => res.json())) as string[];

      // add collaborators to store in alphabetical order
      const sortedCollaborators = collaborators.sort((a, b) =>
        a.localeCompare(b)
      );
      const collaboratorToColor = sortedCollaborators.reduce(
        (acc, collaborator, index) => {
          acc[collaborator] = colors[index % colors.length];
          return acc;
        },
        {} as Record<string, string>
      );

      useCollaboratorColors.setState(collaboratorToColor);

      return collaborators;
    },
    {
      enabled: !!roomId,
    }
  );
}

const colors: string[] = ["#EF8636", "#B1D8A7", "#88BBE4", "#CFC8EF"];

export const useCollaboratorColors = create<Record<string, string>>()(
  (_set) => ({})
);

/**
 * Makes sure we wipe the collaborator color store when we unmount project or public page
 */
export function useCollabColorCleanup() {
  return useEffect(() => {
    return () => {
      useCollaboratorColors.setState({});
    };
  }, []);
}
