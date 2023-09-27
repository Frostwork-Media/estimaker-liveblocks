import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { NodeData } from "../lib/types";
import { SquiggleNodeValue } from "./SquiggleNodeValue";
import { RxBarChart } from "react-icons/rx";
import { useMutation } from "../liveblocks.config";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { SquiggleGraph } from "./SquiggleGraph";
import { getVarName } from "@/lib/getVarName";
import { customNodeWidthClass } from "@/lib/constants";
import classNames from "classnames";
import { SquiggleNode } from "shared";
import { useGraphStore } from "@/lib/useGraphStore";
import { SquiggleNodeMedian } from "./SquiggleNodeMedian";
import {
  ProcessedSquiggleNodeType,
  useSquiggleRunResult,
} from "@/lib/useSquiggleRunResult";
import { emailToVarSuffix } from "@/lib/emailToVarSuffix";
import { useCollaboratorColors } from "@/lib/useCollaborators";

const TITLE_CLASSES =
  "text-center py-2 rounded leading-7 text-4xl leading-tight resize-none focus:outline-none focus:ring-0 focus:border-transparent bg-transparent";
const TOGGLE_GROUP_CLASSES = "flex justify-center rounded space-x-px mt-1";
const TOGGLE_GROUP_ITEM_CLASSES =
  "bg-neutral-100 hover:bg-neutral-300 color-neutral-600 data-[state=on]:bg-blue-700 data-[state=on]:text-neutral-100 flex h-8 w-8 items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:outline-none";

const _handleStyle = {
  width: 12,
  height: 12,
};

const NODE_CONTAINER_CLASSES = "grid gap-3";
const VARIABLE_NAME_CLASSES =
  "font-mono text-blue-600 text-sm text-left tracking-wider w-full overflow-hidden whitespace-nowrap overflow-ellipsis";

/**
 * An individual node in the graphical editor
 */
export function GraphNode({ data, id }: NodeProps<NodeData<SquiggleNode>>) {
  const { label, variableName, showing, content, value, overrides } = data;
  const selected = useGraphStore((state) => state.selected);
  const isSelected = selected.includes(id);
  const handleStyle = useMemo(() => {
    return {
      ..._handleStyle,
      backgroundColor: data.color ? `hsl(${data.color})` : undefined,
    };
  }, [data.color]);

  const procesedRunResult = useSquiggleRunResult(
    (state) => state.processedRunResult
  );
  const nodeType = procesedRunResult?.variables[variableName]?.type;

  /** -- Here is where mutation related code begins -- */

  const [editing, setEditing] = useState(false);

  const setContent = useMutation(
    ({ storage }, newContent: string) => {
      storage.get("squiggle").get(id).set("content", newContent);
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
      for (const id in nodes.toObject()) {
        const node = nodes.get(id);
        if (!node) continue;

        if (node.get("variableName") === oldVariableName)
          node.set("variableName", newVariableName);

        const value = node.get("value");
        if (!value) continue;
        const regex = new RegExp(`\\b${oldVariableName}\\b`, "g");
        node.set("value", value.replace(regex, newVariableName));
      }
    },
    []
  );

  const updateNodeVariableName = useCallback(
    (label: string) => {
      if (!label) return;
      // get current variable name
      const oldVariableName = variableName;
      const newVariableName = getVarName(label);

      // will replace values in all nodes
      changeNodeVarName({ oldVariableName, newVariableName });
      setEditing(false);
    },
    [changeNodeVarName, variableName]
  );

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="py-2">
        <div className={`p-2 grid gap-1 ${customNodeWidthClass}`}>
          <TextareaAutosize
            className={classNames(TITLE_CLASSES, {
              "pointer-events-none": !isSelected,
            })}
            value={content}
            ref={titleInputRef}
            disabled={!isSelected}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            // catch enter key and set label
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                updateNodeVariableName(label);
                // blur
                titleInputRef.current?.blur();
              }
            }}
            data-rename-textarea
            onBlur={() => updateNodeVariableName(label)}
            style={{
              color: data.color ? `hsl(${data.color})` : undefined,
            }}
          />
          {isSelected ? (
            <div className={NODE_CONTAINER_CLASSES}>
              <SquiggleNodeValue nodeId={id} />
              <button
                className={VARIABLE_NAME_CLASSES}
                onClick={() => {
                  // copy variable name to clipboard
                  navigator.clipboard.writeText(variableName);
                }}
              >
                {`{${variableName}}`}
              </button>
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
            </div>
          ) : (
            <>
              {nodeType === "function" ? (
                <FunctionView>{value}</FunctionView>
              ) : (
                <Medians
                  value={value}
                  overrides={overrides}
                  nodeType={nodeType}
                  variableName={variableName}
                />
              )}
            </>
          )}
          {showing === "graph" ? (
            <SquiggleGraph variableName={variableName} overrides={overrides} />
          ) : null}
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
}: NodeProps<NodeData<SquiggleNode>>) {
  const { label, variableName, showing, color, value, overrides } = data;
  const handleStyle = useMemo(() => {
    return {
      ..._handleStyle,
      backgroundColor: data.color ? `hsl(${data.color})` : undefined,
    };
  }, [data.color]);
  const procesedRunResult = useSquiggleRunResult(
    (state) => state.processedRunResult
  );
  const nodeType = procesedRunResult?.variables[variableName]?.type;
  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="py-2">
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
          {nodeType === "function" ? (
            <FunctionView>{value}</FunctionView>
          ) : (
            <Medians
              value={value}
              overrides={overrides}
              nodeType={nodeType}
              variableName={variableName}
            />
          )}
          {showing === "graph" ? (
            <SquiggleGraph variableName={variableName} overrides={overrides} />
          ) : null}
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

/**
 * Displays medians for the owner and all collaborators which have supplied a different value
 */
function Medians({
  value,
  overrides,
  nodeType,
  variableName,
}: {
  value: string;
  overrides: Record<string, string>;
  nodeType: ProcessedSquiggleNodeType | undefined;
  variableName: string;
}) {
  /**
   * Store the emails of non-empty collaborator overrides
   */
  const collab = Object.entries(overrides).reduce<string[]>(
    (acc, [email, value]) => {
      if (value) acc.push(email);
      return acc;
    },
    []
  );

  const colors = useCollaboratorColors();

  return (
    <div className="grid gap-1">
      <SquiggleNodeMedian
        nodeType={nodeType}
        variableName={variableName}
        value={value}
      />
      {collab.map((email) => {
        return (
          <SquiggleNodeMedian
            key={email}
            nodeType={nodeType}
            variableName={`${variableName}_${emailToVarSuffix(email)}`}
            value={overrides[email]}
            displayColor={colors[email]}
          />
        );
      })}
    </div>
  );
}

function FunctionView({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono leading-loose bg-slate-800 text-white p-3 rounded">
      {children}
    </div>
  );
}
