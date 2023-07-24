import { LiveObject, LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useParams, Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { getVarName } from "../lib/getVarName";
import {
  RoomProvider,
  UserMeta,
  useMutation,
  useOthers,
  useSelf,
  useStatus,
  useStorage,
} from "../liveblocks.config";
import { useMemo, useState } from "react";
import cx from "classnames";
import { Graph } from "../components/Graph";
import { colors } from "../lib/constants";

const inputClasses =
  "border border-neutral-300 rounded-md p-2 w-full bg-background h-10";

function Inner() {
  const status = useStatus();
  const { id = "" } = useParams<{ id: string }>();
  const nodes = useStorage((state) => state.nodes);
  const removeNode = useMutation(({ storage }, id: string) => {
    const nodes = storage.get("nodes");
    nodes.delete(id);
  }, []);
  const nodesArray = Array.from(nodes?.entries() ?? []);

  const self = useSelf();
  const others = useOthers();
  const userIds = useMemo(() => {
    let ids: string[] = [];
    if (self) ids.push(self.id);
    if (others) ids = ids.concat(others.map((other) => other.id));
    return ids;
  }, [self, others]);

  if (status === "connecting") return <div>Connecting...</div>;

  return (
    <div className="p-5">
      <header className="grid gap-1 mb-6">
        <Link to="/" className="text-blue-500 text-sm justify-self-start">
          ← Back Home
        </Link>
        <h1 className="text-4xl font-bold">{id}</h1>
      </header>
      <main className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div className="grid gap-8">
          <AddNode />
          <Graph userIds={userIds} />
          <div className="grid gap-3">
            {nodesArray.map(([key, node]) => (
              <div
                key={key}
                className="border border-neutral-300 rounded-xl p-3 grid gap-2"
              >
                <header className="flex justify-between items-start">
                  <span className="text-xl border-b pb-1">{node.content}</span>
                  <button
                    className="bg-red-500 text-background rounded-md p-2 whitespace-nowrap"
                    onClick={() => removeNode(key)}
                  >
                    Delete
                  </button>
                </header>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-sm">
                    {node.variableName}
                  </span>
                  <EditValue nodeId={key} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <Users />
        </aside>
      </main>
    </div>
  );
}

function AddNode() {
  const addNode = useMutation(({ storage }, content: string) => {
    const node = new LiveObject({ content, variableName: getVarName(content) });
    const nodes = storage.get("nodes");
    const id = nanoid();
    nodes.set(id, node);
  }, []);
  return (
    <form
      className="border flex items-center gap-2 max-w-md bg-neutral-100 p-4 rounded-md"
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
  const self = useSelf();
  const others = useOthers();
  return (
    <div className="grid gap-4 min-w-[200px] p-2 bg-neutral-100 shadow rounded-lg sticky top-4">
      {self && <Avatar {...self} userIndex={0} />}
      {others.map((other, index) => (
        <Avatar key={other.id} {...other} userIndex={index + 1} />
      ))}
    </div>
  );
}

function Avatar({ userIndex, ...meta }: UserMeta & { userIndex: number }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={meta.info.picture}
        alt={`${meta.info.name}`}
        className="w-6 h-6 rounded-full"
      />
      <span className="text-xs">{meta.info.name}</span>
      <span
        className={cx("w-4 h-4 block rounded-full")}
        style={{ backgroundColor: colors[userIndex] }}
      />
    </div>
  );
}

export function Room() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Missing ID");
  return (
    <RoomProvider
      id={id}
      initialPresence={{}}
      initialStorage={() => ({
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

function EditValue({ nodeId }: { nodeId: string }) {
  const self = useSelf();
  if (!self) throw new Error("Missing self");
  const valueKey = `${self.id}:${nodeId}`;
  const value = useStorage((state) => state.values.get(valueKey)) ?? "";
  const [currentValue, setCurrentValue] = useState(value);
  const setValue = useMutation(({ storage }, value: string) => {
    const values = storage.get("values");
    values.set(valueKey, value);
  }, []);
  return (
    <form
      className="flex gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const value = formData.get("value");
        if (!(typeof value === "string")) return;
        setValue(value);
      }}
    >
      <input
        className={cx(inputClasses, "font-mono")}
        type="text"
        value={currentValue}
        name="value"
        onChange={(e) => {
          const value = e.target.value;
          setCurrentValue(value);
        }}
      />
      {currentValue !== value && (
        <button className="bg-blue-500 text-background rounded-md p-2 whitespace-nowrap">
          Save
        </button>
      )}
    </form>
  );
}
