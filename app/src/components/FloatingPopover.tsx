import { useClientStore } from "@/lib/useClientStore";
import classNames from "classnames";
import { CSSProperties, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiPlus } from "react-icons/bi";

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
        <DropdownMenuItem>
          <img src="/squiggle-logo.png" className="w-4 h-4 mr-2 inline-block" />
          Squiggle
        </DropdownMenuItem>
        <DropdownMenuItem>
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

  // return (
  //   <Popover.Root
  //     open={floatingPopoverOpen}
  //     onOpenChange={(open) => {
  //       useClientStore.setState({
  //         floatingPopoverOpen: open,
  //       });
  //     }}
  //   >
  //     <Popover.Anchor asChild>
  //       <div
  //         style={
  //           floatingPopoverMousePosition
  //             ? ({
  //                 "--x": floatingPopoverMousePosition.x + "px",
  //                 "--y": floatingPopoverMousePosition.y + "px",
  //               } as CSSProperties)
  //             : {}
  //         }
  //         className={classNames(
  //           "w-px h-px absolute top-[var(--y)] left-[var(--x)]"
  //         )}
  //       />
  //     </Popover.Anchor>
  //     <Popover.Portal>
  //       <PopoverContent className="p-0">Hello World</PopoverContent>
  //     </Popover.Portal>
  //   </Popover.Root>
  // );
}
