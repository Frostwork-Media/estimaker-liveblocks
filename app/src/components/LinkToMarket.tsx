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

export function LinkToMarket({ selected }: { selected: string[] }) {
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
          <div className="grid gap-2">
            <label htmlFor="manifold">
              <h2 className="font-medium text-neutral-900">Manifold Markets</h2>
              <p className="text-neutral-500 text-sm">
                Enter the user/slug of the market you want to link to.
              </p>
            </label>
            <div className="flex gap-2">
              <Input
                id="manifold"
                placeholder="QuantumObserver/will-the-lk99-room-temp-ambient-pre"
                className="flex-1"
              />
              <Button>Link</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
