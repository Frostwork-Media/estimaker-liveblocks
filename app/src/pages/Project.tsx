import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useParams, Link } from "react-router-dom";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useRoom,
  useSelf,
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
import { Collaborate } from "@/components/Collaborate";
import { PublishModal } from "@/components/PublishModal";
import { BiChevronLeft, BiDotsVerticalRounded, BiSave } from "react-icons/bi";
import classNames from "classnames";
import { PROJECT_HEADER_STYLES } from "../lib/sharedProjectStyles";
import { SmallSpinner } from "@/components/SmallSpinner";
import { ProjectSettings } from "@/components/ProjectSettings";
import { useIsOwner } from "@/lib/hooks";
const Graph = lazy(() => import("../components/Graph"));

function Inner() {
  const title = useStorage((state) => state.title) ?? "Untitled";
  const isOwner = useIsOwner();
  const storage = useStorage((x) => x);
  console.log(storage);

  return (
    <div className="h-screen grid grid-rows-[auto_minmax(0,1fr)]">
      <header className={classNames(PROJECT_HEADER_STYLES, "pr-1")}>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/projects">
            <BiChevronLeft className="w-6 h-6 translate-x-px inline mr-1" />
          </Link>
        </Button>
        <PageTitle />
        <div className="ml-auto flex gap-1">
          <UsersInRoom />
          <SquigglePlayground />
          {isOwner ? (
            <>
              <Collaborate />
              <PublishModal />
              <ProjectSettings name={title}>
                <Button variant="secondary" size="icon">
                  <BiDotsVerticalRounded className="w-6 h-6" />
                </Button>
              </ProjectSettings>
            </>
          ) : null}
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
        inputClassName="text-2xl bg-transparent p-2 focus:bg-slate-100 focus:outline-none border-x focus:shadow-inner"
      />
      {title !== newTitle && (
        <Button
          type="submit"
          disabled={setProjectNameMutation.isLoading}
          variant="outline"
        >
          <span className="inline mr-1">
            {setProjectNameMutation.isLoading ? (
              <SmallSpinner />
            ) : (
              <BiSave className="w-4 h-4" />
            )}
          </span>
          Update
        </Button>
      )}
    </form>
  );
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Missing ID");
  return (
    <RoomProvider
      id={id}
      initialPresence={{}}
      initialStorage={() => ({
        title: "Untitled",
        squiggle: new LiveMap([]),
        manifold: new LiveMap([]),
        metaculus: new LiveMap([]),
        suggestedEdges: new LiveMap([]),
      })}
    >
      <ClientSideSuspense
        fallback={
          <div className="h-screen flex justify-center items-center">
            <span className="text-2xl animate-pulse text-purple-500">
              Connecting...
            </span>
          </div>
        }
      >
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
