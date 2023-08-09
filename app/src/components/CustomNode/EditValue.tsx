import { useMutation, useStorage } from "../../liveblocks.config";

export function EditNodeValue({ nodeId }: { nodeId: string }) {
  const node = useStorage((state) => state.nodes.get(nodeId));

  const setNodeValue = useMutation(({ storage }, value: string) => {
    const node = storage.get("nodes").get(nodeId);
    if (!node) return;
    node.set("value", value);
  }, []);
  return (
    <input
      className="border-2 py-1 px-2 font-mono rounded text-neutral-600 text-sm w-full"
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
