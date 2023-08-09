import { LiveObject, LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useParams, Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { getVarName } from "../lib/getVarName";
import {
  RoomProvider,
  useMutation,
  useStatus,
  useStorage,
} from "../liveblocks.config";
import { Graph } from "../components/Graph";
import { useState } from "react";

const inputClasses =
  "border border-neutral-300 rounded-md p-2 w-full bg-background h-10";

function Inner() {
  const status = useStatus();

  if (status === "connecting") return <div>Connecting...</div>;

  return (
    <div className="h-screen">
      <header className="grid gap-4 mb-6 p-6 absolute z-10 max-w-2xl bg-background border shadow top-3 left-3 rounded">
        <Link to="/" className="text-blue-500 text-sm justify-self-start">
          ← Back Home
        </Link>
        <PageTitle />
        <AddNode />
        <Users />
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
      {title !== newTitle && (
        <button
          type="submit"
          className="bg-blue-500 text-background rounded-md p-2 whitespace-nowrap"
        >
          Save
        </button>
      )}
    </form>
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
      <input type="text" name="content" className={inputClasses} />
      <button className="bg-blue-500 text-background rounded-md p-2 whitespace-nowrap">
        Add Node
      </button>
    </form>
  );
}

function Users() {
  // const self = useSelf();
  // const others = useOthers();
  return <div className="grid gap-4">NOT IMPLEMENTED</div>;
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
