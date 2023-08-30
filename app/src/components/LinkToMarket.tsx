import { BiLink } from "react-icons/bi";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useMutation, useStorage } from "@/liveblocks.config";
import { useState } from "react";

export function LinkToMarket({ selected }: { selected: string[] }) {
  const nodeId = selected[0];
  const manifold = useStorage((state) => state.nodes.get(nodeId)?.manifold);
  const linkToManifoldMarket = useMutation(
    ({ storage }, userSlug: string) => {
      const nodes = storage.get("nodes");
      const node = nodes.get(nodeId);
      if (!node) return;
      node.set("manifold", userSlug);
    },
    [nodeId]
  );
  const removeManifoldMarket = useMutation(
    ({ storage }) => {
      const nodes = storage.get("nodes");
      const node = nodes.get(nodeId);
      if (!node) return;
      node.delete("manifold");
    },
    [nodeId]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <BiLink className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link to Market</DialogTitle>
          <DialogDescription>
            Link this node a Manifold Markets or Metaculuous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <EditableLink
            currentValue={manifold}
            save={(value: string) => {
              linkToManifoldMarket(value);
            }}
            clear={removeManifoldMarket}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditableLink({
  currentValue,
  save,
  clear,
}: {
  currentValue?: string;
  save: (value: string) => void;
  clear: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-2">
      <label htmlFor="manifold">
        <h2 className="font-medium text-neutral-900">Manifold Markets</h2>
        <p className="text-slate-500 text-sm">
          Enter the user/slug of the market you want to link to.
        </p>
      </label>
      <div className="flex gap-2">
        <Input
          id="manifold"
          placeholder="QuantumObserver/will-the-lk99-room-temp-ambient-pre"
          className="flex-1"
          {...(currentValue
            ? { value: currentValue, readOnly: true }
            : {
                placeholder:
                  "QuantumObserver/will-the-lk99-room-temp-ambient-pre",
                value,
                onChange: (e) => {
                  setValue(e.target.value);
                },
              })}
        />
        {currentValue ? (
          <Button onClick={clear}>Clear</Button>
        ) : (
          <Button onClick={() => save(value)}>Link</Button>
        )}
      </div>
    </div>
  );
}
