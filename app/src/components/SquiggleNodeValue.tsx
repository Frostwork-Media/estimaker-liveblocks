import { useIsOwner, useLiveblocksUserId } from "@/lib/hooks";
import { useMutation, useStorage } from "../liveblocks.config";

const INPUT_CLASSES =
  "py-1 px-2 font-mono rounded-r text-neutral-600 text-sm w-full h-8 grow focus:outline-none";

export function SquiggleNodeValue({ nodeId }: { nodeId: string }) {
  const isOwner = useIsOwner();
  const userId = useLiveblocksUserId();
  if (!userId) throw new Error("No user id");
  const node = useStorage(({ squiggle }) => squiggle[nodeId]);

  const setNodeValue = useMutation(
    ({ storage }, value: string) => {
      const node = storage.get("squiggle").get(nodeId);
      if (!node) return;
      if (isOwner) {
        node.set("value", value);
      } else {
        // Sets the override if it's not the default user
        node.get("overrides").set(userId, value);
      }
    },
    [isOwner, userId]
  );

  const value = isOwner ? node?.value : node?.overrides?.[userId];

  return (
    <div className="flex group rounded border-2 focus-within:border-slate-300">
      <div className="bg-slate-200 flex items-center justify-center w-8 h-8 border-r-2 group-focus-within:bg-slate-300 group-focus-within:border-r-slate-300">
        <img src="/squiggle-logo.png" className="w-4 h-4 black-and-white" />
      </div>
      <input
        className={INPUT_CLASSES}
        type="text"
        value={value ?? ""}
        placeholder={node.value}
        name="value"
        onChange={(e) => {
          const value = e.target.value;
          setNodeValue(value);
        }}
      />
    </div>
  );
}

export function NodeValueImmutable({ value }: { value: string }) {
  return <span className={INPUT_CLASSES}>{value}</span>;
}
