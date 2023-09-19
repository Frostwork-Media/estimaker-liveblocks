import { LiveList, LiveObject, Lson, LsonObject } from "@liveblocks/client";

export type RecursiveLive<T> = T extends Array<infer U>
  ? U extends Lson
    ? LiveList<RecursiveLive<U>>
    : never
  : T extends LsonObject
  ? LiveObject<{ [K in keyof T]: RecursiveLive<T[K]> }>
  : T extends Lson
  ? T
  : never;

export function toLive<T extends Lson>(input: T): RecursiveLive<T> {
  if (typeof input !== "object" || input === null) {
    return input as RecursiveLive<T>;
  }

  if (Array.isArray(input)) {
    const output = new LiveList<T>();

    for (const item of input) {
      output.push(toLive(item));
    }

    return output as unknown as RecursiveLive<T>;
  }

  const output = new LiveObject();

  for (const key in input) {
    output.set(key, toLive((input as any)[key]));
  }

  return output as RecursiveLive<T>;
}

export function jsonToLive<T extends LsonObject>(
  input: T
): { [K in keyof T]: RecursiveLive<T[K]> } {
  if (typeof input !== "object") throw new Error("Expected object");

  let output: { [K in keyof T]: RecursiveLive<T[K]> } = {} as any;

  for (const key in input) {
    output[key] = toLive(input[key] as Lson) as any;
  }

  return output;
}
