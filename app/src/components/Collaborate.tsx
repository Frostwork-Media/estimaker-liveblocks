import { useRoom } from "../liveblocks.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiCheck, BiGroup, BiLink } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useMutation,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { SmallSpinner } from "./SmallSpinner";
import { useCollaborators } from "@/lib/useCollaborators";
import { useMemo } from "react";

export function Collaborate() {
  const room = useRoom();
  const url = useMemo(() => {
    if (!room.id) return "";
    return `${window.location.origin}/project/${room.id}`;
  }, [room.id]);
  const copyUrlMutation = useMutation(async () => {
    navigator.clipboard.writeText(url);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
  const collaboratorsQuery = useCollaborators(room.id);
  const addUserMutation = useRQMutation(async (userToAdd: string) => {
    if (!room.id) return;
    return fetch(`/api/add-user-to-project`, {
      method: "POST",
      body: JSON.stringify({
        roomId: room.id,
        userToAdd,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      queryClient.invalidateQueries(["project-users", room.id]);
    });
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="secondary">
          <BiGroup className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="grid gap-3">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-bold">Collaborate</h3>
            {collaboratorsQuery.isFetching || addUserMutation.isLoading ? (
              <SmallSpinner />
            ) : null}
          </div>
          {collaboratorsQuery.data?.length ? (
            <>
              <ul className="grid gap-2 max-h-32 overflow-y-auto">
                {collaboratorsQuery.data.map((user) => (
                  <li key={user} className="text-xs text-neutral-500 font-mono">
                    {user}
                  </li>
                ))}
              </ul>
              <hr />
            </>
          ) : null}
          <p className="text-sm text-neutral-600 text-wrap-balance">
            Add people you would like to share this project with via email
          </p>
          <form
            className="flex items-center gap-2 max-w-md rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get("email");
              if (!(typeof email === "string") || !email) return;
              addUserMutation.mutate(email);
              // reset form
              e.currentTarget.reset();
              // forcus input
              const input = e.currentTarget.querySelector("input");
              if (input) input.focus();
            }}
          >
            <Input
              name="email"
              autoComplete="off"
              data-1p-ignore
              disabled={addUserMutation.isLoading}
            />
            <Button
              className="whitespace-nowrap"
              disabled={addUserMutation.isLoading}
            >
              Add
            </Button>
          </form>
          {collaboratorsQuery.data?.length ? (
            <>
              <hr />
              <Button
                variant="secondary"
                onClick={() => {
                  copyUrlMutation.mutate();
                }}
              >
                {copyUrlMutation.isLoading ? (
                  <BiCheck className="w-4 h-4 mr-1" />
                ) : (
                  <BiLink className="w-4 h-4 mr-1" />
                )}
                Copy Share URL
              </Button>
            </>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
