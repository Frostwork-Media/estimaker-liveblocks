import { useMutation, useStorage } from "../liveblocks.config";

const INPUT_CLASSES =
  "border-2 py-1 px-2 font-mono rounded text-neutral-600 text-sm w-full h-8";

export function NodeValue({ nodeId }: { nodeId: string }) {
  const node = useStorage((state) => state.nodes.get(nodeId));

  const setNodeValue = useMutation(({ storage }, value: string) => {
    const node = storage.get("nodes").get(nodeId);
    if (!node) return;
    node.set("value", value);
  }, []);
  return (
    <input
      className={INPUT_CLASSES}
      type="text"
      value={node?.value ?? ""}
      name="value"
      onChange={(e) => {
        const value = e.target.value;
        setNodeValue(value);
      }}
    />
  );
}

export function NodeValueImmutable({ value }: { value: string }) {
  return <span className={INPUT_CLASSES}>{value}</span>;
}
