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
import { MetaforecastResponse } from "shared";

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

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => {
            useClientStore.setState({
              floatingPopoverOpen: false,
              floatingPopoverMousePosition: null,
            });
            setInput("");
          }, 100);
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
                    // onSelect={() => {
                    // }}
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
}
