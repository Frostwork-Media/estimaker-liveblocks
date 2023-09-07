import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BiTrash } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { SmallSpinner } from "./SmallSpinner";
import { useRoom } from "@/liveblocks.config";
import { queryClient } from "@/lib/queryClient";
import { useNavigate } from "react-router-dom";

export function ProjectSettings({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  const room = useRoom();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const deleteProjectMutation = useMutation<{ success: true }, Error>(
    async () => {
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;

      const response = await fetch("/api/delete-project", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: room.id }),
      }).then((res) => res.json());

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    {
      onSuccess: () => {
        // clear the user's project list from cache
        queryClient.invalidateQueries(["projects"]);
        navigate("/app/projects");
      },
    }
  );
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>Update your project</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <h3 className="text-lg">Delete Project</h3>
          <p className="text-sm text-slate-500">
            Deleting a project is permanent and cannot be undone. To confirm,
            type the name of the project:{" "}
            <span className="text-red-600">{name}</span>
          </p>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={name}
          />
          <Button
            variant="destructive"
            disabled={text !== name}
            onClick={() => deleteProjectMutation.mutate()}
          >
            <span className="mr-2">
              {deleteProjectMutation.isLoading ? (
                <SmallSpinner colorClass="text-white" />
              ) : (
                <BiTrash className="inline-block w-4 h-4 mr-1" />
              )}
            </span>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
