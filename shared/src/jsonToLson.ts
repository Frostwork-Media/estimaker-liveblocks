type RecursiveLson<T> = T extends Array<infer U>
  ? LiveList<RecursiveLson<U>>
  : T extends object
  ? LiveObject<{ [K in keyof T]: RecursiveLson<T[K]> }>
  : T;

interface LiveList<T> {
  liveblocksType: "LiveList";
  data: T[];
}

interface LiveObject<T> {
  liveblocksType: "LiveObject";
  data: T;
}

export function jsonToLson<T>(input: T): RecursiveLson<T> {
  if (typeof input !== "object" || input === null) {
    return input as RecursiveLson<T>;
  }

  if (Array.isArray(input)) {
    let output = {
      liveblocksType: "LiveList",
      data: [] as RecursiveLson<T>[],
    };

    for (const item of input) {
      output.data.push(jsonToLson(item));
    }

    return output as RecursiveLson<T>;
  }

  let output = {
    liveblocksType: "LiveObject",
    data: {} as { [K in keyof T]: RecursiveLson<T[K]> },
  };

  for (const key in input) {
    output.data[key] = jsonToLson(input[key]);
  }

  return output as RecursiveLson<T>;
}
