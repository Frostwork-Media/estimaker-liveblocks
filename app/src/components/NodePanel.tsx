import { BiPaint } from "react-icons/bi";
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
      const nodes = storage.get("nodes");
      const node = nodes.get(id);
      if (!node) return;
      node.set("color", color);
    },
    []
  );
  const removeColor = useMutation(({ storage }, id: string) => {
    if (!id) return;
    const nodes = storage.get("nodes");
    const node = nodes.get(id);
    if (!node) return;
    node.delete("color");
  }, []);

  return (
    <div>
      {selected.length === 1 ? (
        <div className="grid gap-1 border rounded shadow-lg">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <BiPaint className="w-6 h-6 text-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="!w-auto p-3">
              <div className="grid gap-2">
                <ColorButton
                  key={"none"}
                  color="0, 0%, 0%"
                  onClick={() => removeColor(selected[0])}
                />
                {nodeColors.map((color) => (
                  <ColorButton
                    key={color.name}
                    color={color.color}
                    onClick={() =>
                      setColor({ color: color.color, id: selected[0] })
                    }
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : null}
    </div>
  );
}

function ColorButton({
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
