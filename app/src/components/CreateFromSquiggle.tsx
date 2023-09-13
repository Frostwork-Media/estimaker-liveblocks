import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { BiPencil } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { SmallSpinner } from "./SmallSpinner";

export function CreateFromSquiggle({
  children,
}: {
  children: React.ReactNode;
}) {
  const [code, setCode] = useState("");
  const createFromSquiggleMutation = useMutation(async () => {
    // wait 3 seconds then return
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setCode("");
        }
        return open;
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create From Squiggle</DialogTitle>
          <DialogDescription>
            Create a new project from exising squiggle code
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="squiggle" className="text-xl">
            Squiggle Code
          </Label>
          <Textarea
            id="squiggle"
            name="squiggle"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={() => createFromSquiggleMutation.mutate()}>
            <span className="mr-2">
              {createFromSquiggleMutation.isLoading ? (
                <SmallSpinner colorClass="text-white" />
              ) : (
                <BiPencil className="w-4 h-4" />
              )}
            </span>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
