import { BiPalette } from "react-icons/bi";
import { Button } from "./ui/button";
import { useGraphStore } from "@/lib/useGraphStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nodeColors } from "@/lib/constants";
import { useMutation } from "@/liveblocks.config";

export function NodePanel() {
  const selected = useGraphStore((state) => state.selected);
  return (
    <Popover open={selected.length === 1}>
      <PopoverTrigger asChild>
        <span />
      </PopoverTrigger>
      <PopoverContent className="flex border border-neutral-300 rounded-lg p-2 shadow bg-white w-auto">
        <ChangeNodeColor selected={selected} />
      </PopoverContent>
    </Popover>
  );
}

function ChangeNodeColor({ selected }: { selected: string[] }) {
  const setColor = useMutation(
    (
      { storage },
      {
        color,
        id,
      }: {
        color: string;
        id: string;
      }
    ) => {
      if (!id || !color) return;
      storage.get("squiggle").get(id).set("color", color);
    },
    []
  );
  const removeColor = useMutation(({ storage }, id: string) => {
    if (!id) return;
    const nodes = storage.get("squiggle");
    const node = nodes.get(id);
    if (!node) return;
    node.delete("color");
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <BiPalette className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="!w-auto p-3">
        <div className="flex gap-2">
          <SingleColorButton
            key={"none"}
            color="0, 0%, 0%"
            onClick={() => removeColor(selected[0])}
          />
          {nodeColors.map((color) => (
            <SingleColorButton
              key={color.name}
              color={color.color}
              onClick={() => setColor({ color: color.color, id: selected[0] })}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SingleColorButton({
  color,
  ...props
}: { color: string } & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={`w-6 h-6 rounded-full ring-2 ring-blue/0 ring-offset-2 ring-offset-white hover:ring-blue/50`}
      style={{ backgroundColor: `hsl(${color})` }}
      {...props}
    />
  );
}
