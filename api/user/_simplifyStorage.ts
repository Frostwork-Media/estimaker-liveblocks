// @ts-nocheck
import clone from "clone";

export function simplifyStorage(_obj: unknown) {
  const obj = clone(_obj);
  // If not object, return
  if (typeof obj !== "object" || obj == null) return obj;

  // If not LiveObject or LiveMap, return
  if (
    !("liveblocksType" in obj) ||
    !("data" in obj) ||
    !(typeof obj.data === "object") ||
    obj.data == null
  )
    return obj;

  if (obj.liveblocksType === "LiveObject") {
    for (const key in obj.data) {
      obj.data[key] = simplifyStorage(obj.data[key]);
    }
    return obj.data;
  } else if (obj.liveblocksType === "LiveMap") {
    const newData = {};
    for (const key in obj.data) {
      newData[key] = simplifyStorage(obj.data[key]);
    }
    return newData;
  } else if (obj.liveblocksType === "LiveList") {
    const newData = [];
    for (const key in obj.data) {
      newData.push(simplifyStorage(obj.data[key]));
    }
    return newData;
  } else {
    throw new Error("Unknown liveblocksType: " + obj.liveblocksType);
  }
}
