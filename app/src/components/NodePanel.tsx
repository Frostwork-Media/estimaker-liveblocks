import { BiPaint, BiPalette } from "react-icons/bi";
import { Button } from "./ui/button";
import { useGraphStore } from "@/lib/useGraphStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nodeColors } from "@/lib/constants";

export function NodePanel() {
  const selected = useGraphStore((state) => state.selected);

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
            <PopoverContent side="right" align="start" className="!w-auto p-2">
              <div className="grid gap-2">
                <button className="w-8 h-8 rounded-full bg-foreground" />
                {nodeColors.map((color) => (
                  <Button
                    variant="ghost"
                    key={color.name}
                    className={`w-8 h-8 rounded-full`}
                    style={{ backgroundColor: color.color }}
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
