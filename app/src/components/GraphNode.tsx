import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { NodeData } from "../lib/types";
import { SquiggleNodeValue, NodeValueImmutable } from "./SquiggleNodeValue";
import { RxBarChart, RxCross1 } from "react-icons/rx";
import { useMutation } from "../liveblocks.config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { SquiggleGraph } from "./SquiggleGraph";
import { getVarName } from "@/lib/getVarName";
import { customNodeWidthClass } from "@/lib/constants";
import classNames from "classnames";
import { SquiggleNode } from "shared";

const TITLE_CLASSES =
  "text-left py-2 rounded leading-7 text-4xl leading-tight resize-none focus:outline-none focus:ring-0 focus:border-transparent bg-transparent";
const TITLE_CLASSES_INTERACTIVE = "hover:bg-neutral-200";
const TOGGLE_GROUP_CLASSES = "flex justify-center rounded space-x-px mt-1";
const TOGGLE_GROUP_ITEM_CLASSES =
  "bg-neutral-100 hover:bg-neutral-300 color-neutral-600 data-[state=on]:bg-blue-700 data-[state=on]:text-neutral-100 flex h-8 w-8 items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:outline-none";

const _handleStyle = {
  width: 12,
  height: 12,
};

const NODE_CONTAINER_CLASSES =
  "px-2 py-3 rounded-md border bg-white grid gap-3 shadow-sm";
const VARIABLE_NAME_CLASSES =
  "font-mono text-blue-600 text-sm text-left tracking-wider w-full overflow-hidden whitespace-nowrap overflow-ellipsis";

/**
 * An individual node in the graphical editor
 */
export function GraphNode({ data, id }: NodeProps<NodeData<SquiggleNode>>) {
  const { label, variableName, showing } = data;
  const handleStyle = useMemo(() => {
    return {
      ..._handleStyle,
      backgroundColor: data.color ? `hsl(${data.color})` : undefined,
    };
  }, [data.color]);

  /** -- Here is where mutation related code begins -- */

  const deleteNode = useMutation(
    ({ storage }) => {
      if (!window.confirm("Are you sure you want to delete this node?")) return;
      storage.get("squiggle").delete(id);
    },
    [id]
  );

  const [editing, setEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const setLabel = useMutation(
    ({ storage }, label: string) => {
      const node = storage.get("squiggle").get(id);
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
      const node = storage.get("squiggle").get(id);
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
      const nodes = storage.get("squiggle");
      for (const id in nodes) {
        const node = nodes.get(id);
        if (node.get("variableName") === oldVariableName)
          node.set("variableName", newVariableName);

        const value = node.get("value");
        if (!value) continue;
        const regex = new RegExp(`\\b${oldVariableName}\\b`, "g");
        node.set("value", value.replace(regex, newVariableName));
      }
      storage.set("squiggle", nodes);
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
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className={`bg-transparent grid gap-1 ${customNodeWidthClass}`}>
        <div className="flex justify-end pr-1 pt-1">
          <button className="text-blue-600 text-base" onClick={deleteNode}>
            <RxCross1 />
          </button>
        </div>
        {editing ? (
          <TextareaAutosize
            className={classNames(TITLE_CLASSES, TITLE_CLASSES_INTERACTIVE)}
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
            className={classNames(TITLE_CLASSES, TITLE_CLASSES_INTERACTIVE)}
            data-rename-button
            style={data.color ? { color: `hsl(${data.color})` } : {}}
            onClick={() => {
              setEditing(true);
            }}
          >
            {label}
          </button>
        )}
        <div className={NODE_CONTAINER_CLASSES}>
          <button
            className={VARIABLE_NAME_CLASSES}
            onClick={() => {
              // copy variable name to clipboard
              navigator.clipboard.writeText(variableName);
            }}
          >
            {`{${variableName}}`}
          </button>
          <SquiggleNodeValue nodeId={id} />
          <ToggleGroup.Root
            className={TOGGLE_GROUP_CLASSES}
            type="single"
            value={showing}
            onValueChange={(showing) => {
              setShowing(showing as "graph" | undefined);
            }}
          >
            <ToggleGroup.Item
              className={TOGGLE_GROUP_ITEM_CLASSES}
              value="graph"
              aria-label="Left aligned"
            >
              <RxBarChart />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
          {showing === "graph" ? <SquiggleGraph nodeId={id} /> : null}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
      />
    </>
  );
}

export function GraphNodeImmutable({
  data,
  id,
}: NodeProps<NodeData<SquiggleNode>>) {
  const { label, variableName, showing, color } = data;
  const handleStyle = useMemo(() => {
    return {
      ..._handleStyle,
      backgroundColor: data.color ? `hsl(${data.color})` : undefined,
    };
  }, [data.color]);

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div
        className={classNames(
          "bg-transparent grid gap-1",
          "nodrag",
          customNodeWidthClass
        )}
      >
        <h2
          className={TITLE_CLASSES}
          style={color ? { color: `hsl(${data.color})` } : {}}
        >
          {label}
        </h2>
        <div className={NODE_CONTAINER_CLASSES}>
          <span className={VARIABLE_NAME_CLASSES}>{`{${variableName}}`}</span>
          <NodeValueImmutable value={data.value} />
          <ToggleGroup.Root
            className={TOGGLE_GROUP_CLASSES}
            type="single"
            value={showing}
          >
            <ToggleGroup.Item
              className={TOGGLE_GROUP_ITEM_CLASSES}
              value="graph"
              aria-label="Left aligned"
            >
              <RxBarChart />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
          {showing === "graph" ? <SquiggleGraph nodeId={id} /> : null}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
      />
    </>
  );
}
