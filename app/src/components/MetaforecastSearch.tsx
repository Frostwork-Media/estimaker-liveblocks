import { useClientStore } from "@/lib/useClientStore";
import classNames from "classnames";
import { CSSProperties, useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";
import { searchMetaforecast } from "@/lib/searchMetaforecast";
import { MetaforecastResponse, Schema, toLive } from "shared";
import { useMutation } from "@/liveblocks.config";
import { nanoid } from "nanoid";
import { useReactFlow } from "reactflow";

/**
 * A menu that appears over the graph to add nodes
 */
export function MetaforecastSearch() {
  const floatingPopoverOpen = useClientStore(
    (state) => state.floatingPopoverOpen
  );
  const floatingPopoverMousePosition = useClientStore(
    (state) => state.floatingPopoverMousePosition
  );

  const [open, setOpen] = useState(false);
  // save coords when popover is opened
  const [coords, setCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    if (floatingPopoverOpen) {
      setCoords(floatingPopoverMousePosition);
    } else {
      setCoords(null);
    }
  }, [floatingPopoverOpen, floatingPopoverMousePosition]);

  useEffect(() => {
    if (!floatingPopoverOpen) return;
    requestAnimationFrame(() => {
      setOpen(true);
    });
  }, [floatingPopoverOpen]);

  const [input, setInput] = useState("");
  const debouncedInput = useDebouncedValue(input, 300);

  const searchQuery = useQuery<MetaforecastResponse[]>(
    ["metaforecast", debouncedInput],
    () => searchMetaforecast(debouncedInput),
    {
      enabled: debouncedInput.length > 2,
    }
  );

  const isDebouncing = debouncedInput !== input;
  const reactFlowInstance = useReactFlow();

  const addMetaforecastNode = useMutation(
    ({ storage }, link: string) => {
      if (!coords) return;
      const projectedCoords = reactFlowInstance.project(coords);
      const id = nanoid();
      const node: Schema["metaforecast"][string] = {
        x: projectedCoords.x,
        y: projectedCoords.y,
        link,
        nodeType: "metaforecast",
      };
      storage.get("metaforecast").set(id, toLive(node));
    },
    [coords]
  );

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          close();
        }
      }}
    >
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="p-0 w-[450px] max-h-[400px] overflow-auto"
      >
        <Command>
          <CommandInput
            placeholder="Type at least 3 characters to search..."
            value={input}
            className="w-full sticky top-0 z-10"
            onValueChange={(input) => {
              setInput(input);
            }}
          />
          <CommandList>
            <CommandEmpty>
              {isDebouncing
                ? "..."
                : searchQuery.isLoading
                ? "Loading..."
                : "No Results"}
            </CommandEmpty>
            {!isDebouncing && searchQuery.data ? (
              <CommandGroup>
                {searchQuery.data.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => {
                      addMetaforecastNode(result.id);
                      setOpen(false);
                      close();
                    }}
                  >
                    {result.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  function close() {
    setTimeout(() => {
      useClientStore.setState({
        floatingPopoverOpen: false,
        floatingPopoverMousePosition: null,
      });
      setInput("");
    }, 100);
  }
}
