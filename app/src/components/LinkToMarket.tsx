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
import { useMutation } from "@/liveblocks.config";
import { EditableLink } from "./EditableLink";

export function LinkToMarket({ selected }: { selected: string[] }) {
  const nodeId = selected[0];
  const linkToMarket = useMutation(
    ({ storage }, market: "manifold" | "metaculus", value: string) => {
      const nodes = storage.get("squiggle");
      const node = nodes.get(nodeId);
      if (!node) return;
      node.set(market, value);
    },
    [nodeId]
  );
  const removeMarket = useMutation(
    ({ storage }, market: "manifold" | "metaculus") => {
      const nodes = storage.get("squiggle");
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
            save={(value: string) => {
              linkToMarket("manifold", value);
            }}
            clear={() => removeMarket("manifold")}
          />
          <EditableLink
            title="Metaculus"
            description="Enter the id of the question you want to link to."
            placeholder="11589"
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
