import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { AppNodeData } from "../../lib/types";
import { EditNodeValue } from "./EditValue";
import { RxBarChart, RxCross1 } from "react-icons/rx";
import { useMutation } from "../../liveblocks.config";
import { useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { CustomNodeGraph } from "./CustomNodeGraph";
import { getVarName } from "@/lib/getVarName";

const titleClasses =
  "text-left text-blue-800 p-3 py-2 rounded leading-7 text-2xl leading-tight resize-none focus:outline-none focus:ring-0 focus:border-transparent bg-blue-100";

const toggleGroupItemClasses =
  "bg-neutral-100 hover:bg-neutral-300 color-neutral-600 data-[state=on]:bg-blue-700 data-[state=on]:text-neutral-100 flex h-8 w-8 items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:outline-none";

export function CustomNode({ data, id }: NodeProps<AppNodeData>) {
  const { label, variableName, showing } = data;
  const deleteNode = useMutation(
    ({ storage }) => {
      if (!window.confirm("Are you sure you want to delete this node?")) return;
      const nodes = storage.get("nodes");
      nodes.delete(id);
    },
    [id]
  );

  const [editing, setEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const setLabel = useMutation(
    ({ storage }, label: string) => {
      const nodes = storage.get("nodes");
      const node = nodes.get(id);
      if (!node) return;
      node.set("content", label);
    },
    [id]
  );
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (editing) {
      titleInputRef.current?.focus();
      // move cursor to end
      titleInputRef.current?.setSelectionRange(
        titleInputRef.current.value.length,
        titleInputRef.current.value.length
      );
    }
  }, [editing]);

  // squiggle code
  const setShowing = useMutation(
    ({ storage }, showing?: "graph") => {
      const nodes = storage.get("nodes");
      const node = nodes.get(id);
      if (!node) return;
      node.set("showing", showing);
    },
    [id]
  );

  const changeNodeVarName = useMutation(
    (
      { storage },
      {
        oldVariableName,
        newVariableName,
      }: { oldVariableName: string; newVariableName: string }
    ) => {
      const nodes = storage.get("nodes");
      for (const node of nodes.values()) {
        const variableName = node.get("variableName");
        if (variableName === oldVariableName)
          node.set("variableName", newVariableName);

        const value = node.get("value");
        if (!value) continue;
        const regex = new RegExp(`\\b${oldVariableName}\\b`, "g");
        const newValue = value.replace(regex, newVariableName);
        node.set("value", newValue);
      }
    },
    []
  );

  const updateNodeLabel = useCallback(
    (label: string) => {
      if (!label) return;
      // get current variable name
      const oldVariableName = variableName;
      const newVariableName = getVarName(label);

      // will replace values in all nodes
      changeNodeVarName({ oldVariableName, newVariableName });

      setLabel(label);
      setEditing(false);
    },
    [changeNodeVarName, setLabel, variableName]
  );

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="bg-neutral-100 p-1 w-[275px] grid gap-1">
        <div className="flex justify-end pr-1 pt-1">
          <button className="text-blue-600 text-sm" onClick={deleteNode}>
            <RxCross1 />
          </button>
        </div>
        {editing ? (
          <TextareaAutosize
            className={titleClasses}
            value={currentLabel}
            ref={titleInputRef}
            onChange={(e) => {
              setCurrentLabel(e.target.value);
            }}
            // catch enter key and set label
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                updateNodeLabel(e.currentTarget.value);
              }
            }}
            onBlur={() => updateNodeLabel(currentLabel)}
          />
        ) : (
          <button
            className={titleClasses}
            data-rename-button
            onClick={() => {
              setEditing(true);
            }}
          >
            {label}
          </button>
        )}
        <div className="px-2 py-3 rounded-md bg-[white] grid gap-3 shadow-sm">
          <button
            className="font-mono text-blue-600 text-sm text-left tracking-wider w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
            onClick={() => {
              // copy variable name to clipboard
              navigator.clipboard.writeText(variableName);
            }}
          >
            {`{${variableName}}`}
          </button>
          <EditNodeValue nodeId={id} />
          <ToggleGroup.Root
            className="flex justify-center rounded space-x-px mt-1"
            type="single"
            value={showing}
            onValueChange={(showing) => {
              setShowing(showing as "graph" | undefined);
            }}
          >
            <ToggleGroup.Item
              className={toggleGroupItemClasses}
              value="graph"
              aria-label="Left aligned"
            >
              <RxBarChart />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
          <CustomNodeGraph showing={showing === "graph"} nodeId={id} />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}