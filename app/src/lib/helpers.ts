import { useMemo } from "react";
import { squiggleReservedWords } from "./constants";
import { fromByteArray } from "base64-js";
import { deflate } from "pako";
import toposort from "toposort";
import { useStorage } from "@/liveblocks.config";

/** Finds variable names in a value */
export function getVariables(value: string) {
  const matches = value.matchAll(/([a-z]\w*)/gi);
  const safeMatches: string[] = [];
  for (const match of matches) {
    const variableName = match[1];
    if (squiggleReservedWords.includes(variableName)) continue;
    safeMatches.push(variableName);
  }
  return safeMatches;
}

export function useProjectCode() {
  const liveNodes = useStorage((storage) => storage.squiggle);
  const nodesArray = Array.from(liveNodes.entries());
  const squiggleCode = useMemo(() => {
    try {
      const deps: [string, string][] = [];
      const nodeIds: string[] = [];
      // loop over nodes
      for (const [id, node] of nodesArray) {
        // if it doesn't have a value skip it
        if (!node.value) continue;

        // add it to our array of ids
        nodeIds.push(id);

        // get the variables in the value
        const variablesInValue = getVariables(node.value);

        // for each variable in the value
        for (const variableName of variablesInValue) {
          // check if there is a node with that variable name
          const foundNode = nodesArray.find(([_id, node]) => {
            return node.variableName === variableName;
          });

          // if there is then add it to the deps
          if (foundNode) {
            const [sourceNodeId] = foundNode;
            deps.push([sourceNodeId, id]);
          }
        }
      }

      // toposort all the nodes, even ones with no deps
      const sortedIds = toposort.array(Array.from(new Set(nodeIds)), deps);

      // map over sorted ids and create the code line by line
      const code = sortedIds
        .map((id) => {
          const found = nodesArray.find(([nodeId]) => nodeId === id) ?? [];
          if (!found) return "";
          const [, node] = found;
          if (!node) return "";
          return `${node.variableName} = ${node.value}`;
        })
        .join("\n");

      return code;
    } catch (error) {
      console.error(error);
      return "";
    }
  }, [nodesArray]);
  return squiggleCode;
}

export function useSquigglePlaygroundUrl() {
  const code = useProjectCode();
  const data = { defaultCode: code };
  const text = JSON.stringify(data);
  const compressed = deflate(text, { level: 9 });
  const hash = `#code=${encodeURIComponent(fromByteArray(compressed))}`;
  return `https://www.squiggle-language.com/playground${hash}`;
}

/**
 * This is not used but feel it may come in handy later
 */
export function readonlyMapToObject<K extends string, V>(
  map: ReadonlyMap<K, V>
): Record<K, V> {
  const obj = {} as Record<K, V>;
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

/**
 * Whether or not the user is editing something
 */
export function isEditing() {
  return [
    "INPUT",
    "TEXTAREA",
    "SELECT",
    "BUTTON",
    "A",
    "LABEL",
    "SUMMARY",
    "DETAILS",
    "TEXTAREA",
    "OPTION",
    "OPTGROUP",
    "PROGRESS",
    "METER",
    "OUTPUT",
    "SELECT",
    "TEXTAREA",
  ].some((tagName) => document.activeElement?.tagName === tagName);
}

/**
 * Converts a ReadonlyMap to a regular javascript object
 */
export function mapToObject<K extends string, V>(
  map: ReadonlyMap<K, V>
): Record<K, V> {
  const obj = {} as Record<K, V>;
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}
