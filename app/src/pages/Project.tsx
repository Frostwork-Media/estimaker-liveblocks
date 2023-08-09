import { LiveObject, LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useParams, Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { getVarName } from "../lib/getVarName";
import {
  RoomProvider,
  useMutation,
  useRoom,
  useStatus,
  useStorage,
} from "../liveblocks.config";
import { Graph } from "../components/Graph";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiGroup } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation as useRQMutation } from "@tanstack/react-query";

function Inner() {
  const status = useStatus();
  const room = useRoom();
  const projectUsers = useQuery<string[]>(
    ["project-users"],
    async () => {
      if (!room.id) return;
      const res = await fetch(`/api/project-users?roomId=${room.id}`);
      return res.json();
    },
    {
      enabled: !!room.id,
    }
  );
  if (status === "connecting") return <div>Connecting...</div>;

  return (
    <div className="h-screen">
      <header className="grid gap-4 mb-6 p-6 absolute z-10 max-w-2xl bg-white border shadow top-3 left-3 rounded">
        <Link to="/" className="text-blue-500 text-sm justify-self-start">
          ← Back Home
        </Link>
        <PageTitle />
        <Share users={projectUsers.data} />
        <AddNode />
      </header>
      <Graph />
    </div>
  );
}

function PageTitle() {
  const title = useStorage((state) => state.title) ?? "Untitled";
  const [newTitle, setNewTitle] = useState(title);

  const updateTitle = useMutation(({ storage }, title: string) => {
    storage.set("title", title);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateTitle(newTitle);
        const form = e.currentTarget;
        if (!form) return;
        form.querySelector("input")?.blur();
      }}
      className="grid gap-1"
    >
      <input
        className="text-2xl font-bold bg-transparent border-b py-2 px-1 focus:bg-neutral-100 focus:outline-none"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      {title !== newTitle && <Button type="submit">Save</Button>}
    </form>
  );
}

function Share({ users }: { users?: string[] }) {
  const room = useRoom();
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
    });
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <BiGroup className="mr-2 w-6 h-6" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="grid gap-3">
          <h3 className="text-lg font-bold">Share</h3>
          {users?.length ? (
            <>
              <ul className="grid gap-2 max-h-32 overflow-y-auto">
                {users.map((user) => (
                  <li key={user} className="text-sm text-neutral-600 font-mono">
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
              type="email"
              name="email"
              autoComplete="off"
              disabled={addUserMutation.isLoading}
            />
            <Button
              className="whitespace-nowrap"
              disabled={addUserMutation.isLoading}
            >
              Add
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AddNode() {
  const addNode = useMutation(({ storage }, content: string) => {
    const nodes = storage.get("nodes");
    // get most recent node
    const lastNode = Array.from(nodes.values()).pop();
    const x = lastNode?.get("x") ?? 0;
    const y = lastNode?.get("y") ?? 0;
    const node = new LiveObject({
      content,
      variableName: getVarName(content),
      x: x + 100,
      y,
    });
    const id = nanoid();
    nodes.set(id, node);
  }, []);
  return (
    <form
      className="flex items-center gap-2 max-w-md rounded-md"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const content = formData.get("content");
        if (!(typeof content === "string") || !content) return;
        addNode(content);
        // reset form
        e.currentTarget.reset();
        // forcus input
        const input = e.currentTarget.querySelector("input");
        if (input) input.focus();
      }}
    >
      <Input type="text" name="content" />
      <Button className="whitespace-nowrap">Add Node</Button>
    </form>
  );
}

export function Project() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Missing ID");
  return (
    <RoomProvider
      id={id}
      initialPresence={{}}
      initialStorage={() => ({
        title: "Untitled",
        nodes: new LiveMap([]),
        values: new LiveMap([]),
      })}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => <Inner />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
