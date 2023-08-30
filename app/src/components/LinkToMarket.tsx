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
  const metaculus = useStorage((state) => state.nodes.get(nodeId)?.metaculus);
  const linkToMarket = useMutation(
    ({ storage }, market: "manifold" | "metaculus", value: string) => {
      const nodes = storage.get("nodes");
      const node = nodes.get(nodeId);
      if (!node) return;
      node.set(market, value);
    },
    [nodeId]
  );
  const removeMarket = useMutation(
    ({ storage }, market: "manifold" | "metaculus") => {
      const nodes = storage.get("nodes");
      const node = nodes.get(nodeId);
      if (!node) return;
      node.delete(market);
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
            Link this node a Manifold Market or Metaculus.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <EditableLink
            title="Manifold Markets"
            description="Enter the slug of the market you want to link to."
            placeholder="will-the-lk99-room-temp-ambient-pre"
            currentValue={manifold}
            save={(value: string) => {
              linkToMarket("manifold", value);
            }}
            clear={() => removeMarket("manifold")}
          />
          <EditableLink
            title="Metaculus"
            description="Enter the id of the question you want to link to."
            placeholder="11589"
            currentValue={metaculus}
            save={(value: string) => {
              linkToMarket("metaculus", value);
            }}
            clear={() => removeMarket("metaculus")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditableLink({
  title,
  description,
  placeholder,
  currentValue,
  save,
  clear,
}: {
  title: string;
  description: string;
  placeholder: string;
  currentValue?: string;
  save: (value: string) => void;
  clear: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-2">
      <label htmlFor="manifold">
        <h2 className="font-medium text-neutral-900">{title}</h2>
        <p className="text-slate-500 text-sm">{description}</p>
      </label>
      <div className="flex gap-2">
        <Input
          id="manifold"
          placeholder={placeholder}
          className="flex-1"
          {...(currentValue
            ? { value: currentValue, readOnly: true }
            : {
                value,
                onChange: (e) => {
                  setValue(e.target.value);
                },
              })}
        />
        {currentValue ? (
          <Button onClick={clear} variant="destructive">
            Clear
          </Button>
        ) : (
          <Button onClick={() => save(value)}>Link</Button>
        )}
      </div>
    </div>
  );
}
