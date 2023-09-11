import { useClientStore } from "@/lib/useClientStore";
import classNames from "classnames";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiPlus } from "react-icons/bi";
import { useAddSquiggleNodeAtPosition } from "@/lib/useLive";
import { useReactFlow } from "reactflow";

/**
 * A menu that appears over the graph to add nodes
 */
export function FloatingPopover() {
  const floatingPopoverOpen = useClientStore(
    (state) => state.floatingPopoverOpen
  );
  const floatingPopoverMousePosition = useClientStore(
    (state) => state.floatingPopoverMousePosition
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!floatingPopoverOpen) return;
    requestAnimationFrame(() => {
      setOpen(true);
    });
  }, [floatingPopoverOpen]);

  /** Handlers */
  const addSquiggleNodeAtPosition = useAddSquiggleNodeAtPosition();
  const reactFlowInstance = useReactFlow();
  const addSquiggleNode = useCallback(() => {
    // get the position
    const position = useClientStore.getState().floatingPopoverMousePosition;
    if (!position) return;

    const projectedCoords = reactFlowInstance.project(position);

    addSquiggleNodeAtPosition(projectedCoords);
  }, [addSquiggleNodeAtPosition, reactFlowInstance]);

  const addManifoldNode = useCallback(() => {
    console.log("Hello World");
  }, []);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => {
            useClientStore.setState({
              floatingPopoverOpen: false,
              floatingPopoverMousePosition: null,
            });
          }, 100);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <div
          style={
            floatingPopoverMousePosition
              ? ({
                  "--x": floatingPopoverMousePosition.x + "px",
                  "--y": floatingPopoverMousePosition.y + "px",
                } as CSSProperties)
              : {}
          }
          className={classNames(
            "w-px h-px absolute top-[var(--y)] left-[var(--x)]"
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuLabel>
          <BiPlus className="w-4 h-4 mr-2 inline-block" />
          Add Node
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={addSquiggleNode}>
          <img src="/squiggle-logo.png" className="w-4 h-4 mr-2 inline-block" />
          Squiggle
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={addManifoldNode}>
          <img
            src="/manifold-market-logo.svg"
            className="w-4 h-4 mr-2 inline-block"
          />
          Manifold Market
        </DropdownMenuItem>
        <DropdownMenuItem>
          <img src="/metaculus.png" className="w-4 h-4 mr-2 inline-block" />
          Metaculus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
