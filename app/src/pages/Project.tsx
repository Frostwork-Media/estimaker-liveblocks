import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useParams, Link } from "react-router-dom";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useRoom,
  useSelf,
  useStatus,
  useStorage,
} from "../liveblocks.config";
import { lazy, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation as useRQMutation } from "@tanstack/react-query";
import AutosizeInput from "react-input-autosize";
import { useSquigglePlaygroundUrl } from "@/lib/helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareList } from "@/components/ShareList";
import { PublishModal } from "@/components/PublishModal";
import { BiLeftArrowAlt } from "react-icons/bi";
const Graph = lazy(() => import("../components/Graph"));

function Inner() {
  const status = useStatus();
  if (status === "connecting")
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="text-2xl">Connecting...</span>
      </div>
    );

  return (
    <div className="h-screen grid grid-rows-[auto_minmax(0,1fr)]">
      <header className="flex items-center gap-4 pl-6 pr-1 border-b">
        <Link
          to="/app/projects"
          className="text-blue-500 text-sm justify-self-start mt-1"
        >
          <BiLeftArrowAlt className="w-4 h-4 inline mr-1" />
          Back Home
        </Link>
        <PageTitle />
        <div className="ml-auto flex gap-1">
          <UsersInRoom />
          <SquigglePlayground />
          <ShareList />
          <PublishModal />
        </div>
      </header>
      <Graph />
    </div>
  );
}

function SquigglePlayground() {
  const url = useSquigglePlaygroundUrl();
  return (
    <Button asChild variant="secondary" size="icon">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img className="w-6 h-6" src="/squiggle-logo.png" />
      </a>
    </Button>
  );
}

function PageTitle() {
  const title = useStorage((state) => state.title) ?? "Untitled";
  const [newTitle, setNewTitle] = useState(title);

  const updateRealtimeTitle = useMutation(({ storage }, title: string) => {
    storage.set("title", title);
  }, []);

  const room = useRoom();
  const setProjectNameMutation = useRQMutation(
    async (newName: string) => {
      if (!room.id) return;
      return fetch(`/api/set-project-name`, {
        method: "POST",
        body: JSON.stringify({
          roomId: room.id,
          newName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    {
      onSuccess: (_response, newName) => {
        updateRealtimeTitle(newName);
      },
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setProjectNameMutation.mutate(newTitle);
        const form = e.currentTarget;
        if (!form) return;
        form.querySelector("input")?.blur();
      }}
      className="flex gap-1 items-center"
    >
      <AutosizeInput
        name="form-field-name"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        disabled={setProjectNameMutation.isLoading}
        inputClassName="text-2xl bg-transparent py-2 px-1 focus:bg-neutral-200 focus:outline-none"
      />
      {title !== newTitle && (
        <Button type="submit" disabled={setProjectNameMutation.isLoading}>
          Save
        </Button>
      )}
    </form>
  );
}

// function AddNode() {
//   const addNode = useMutation(({ storage }, content: string) => {
//     const nodes = storage.get("nodes");
//     // get most recent node
//     const lastNode = Array.from(nodes.values()).pop();
//     const x = lastNode?.get("x") ?? 0;
//     const y = lastNode?.get("y") ?? 0;
//     const node = new LiveObject({
//       content,
//       variableName: getVarName(content),
//       x: x + 100,
//       y,
//       value: "",
//     });
//     const id = nanoid();
//     nodes.set(id, node);
//   }, []);
//   return (
//     <form
//       className="flex items-center gap-2 max-w-md rounded-md"
//       onSubmit={(e) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         const content = formData.get("content");
//         if (!(typeof content === "string") || !content) return;
//         addNode(content);
//         // reset form
//         e.currentTarget.reset();
//         // forcus input
//         const input = e.currentTarget.querySelector("input");
//         if (input) input.focus();
//       }}
//     >
//       <Input type="text" name="content" />
//       <Button className="whitespace-nowrap">Add Node</Button>
//     </form>
//   );
// }

export default function Project() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Missing ID");
  return (
    <RoomProvider
      id={id}
      initialPresence={{}}
      initialStorage={() => ({
        title: "Untitled",
        nodes: new LiveMap([]),
        suggestedEdges: new LiveMap([]),
      })}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => <Inner />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

function UsersInRoom() {
  const self = useSelf((state) => state.info);
  const others = useOthers().map(({ info, id }) => ({ ...info, id }));
  return (
    <div className="flex mr-4">
      {self && <UserInRoom {...self} />}
      {others.map((user) => (
        <UserInRoom key={user.id} {...user} />
      ))}
    </div>
  );
}

function UserInRoom(info: { name: string; picture: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className="-ml-2">
        <img
          src={info.picture}
          alt={info.name}
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </TooltipTrigger>
      <TooltipContent>
        <span>{info.name}</span>
      </TooltipContent>
    </Tooltip>
  );
}
