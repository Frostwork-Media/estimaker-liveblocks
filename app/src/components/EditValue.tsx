import { useMutation, useSelf, useStorage } from "../liveblocks.config";
import { useState } from "react";
import { RxCheck } from "react-icons/rx";

export function EditValue({ nodeId }: { nodeId: string }) {
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
        className="border-2 py-1 px-2 font-mono rounded text-neutral-600 text-sm w-full"
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
          <RxCheck />
        </button>
      )}
    </form>
  );
}
