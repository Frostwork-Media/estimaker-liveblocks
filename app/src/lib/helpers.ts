import { squiggleReservedWords } from "./constants";
import { fromByteArray } from "base64-js";
import { deflate } from "pako";
import { useProjectCode } from "./useProjectCode";

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

/**
 * Auto-select the input for naming the node
 **/
export function focusNodeTitleInput(id: string) {
  setTimeout(() => {
    // Find the element with the [data-id] attribute equal to the
    // id of the node we just created
    const element = document.querySelector(`[data-id="${id}"]`);
    if (!element) return;

    // find the data-rename-textarea and put the cursor in it
    const input = element.querySelector(
      "[data-rename-textarea]"
    ) as HTMLTextAreaElement;
    if (!input) return;

    input.focus();
  }, 100);
}
