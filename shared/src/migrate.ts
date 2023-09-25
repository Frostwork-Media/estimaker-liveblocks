import { upkeep } from "object.upkeep";
import { INITIAL_STORAGE_RAW, Schema } from "./schema";

const migrations = new Map();
migrations.set("1", () => {
  return INITIAL_STORAGE_RAW;
});

migrations.set("2", (data: any) => {
  const newData = structuredClone(data);

  // delete "manifold" and "metaculus" keys
  delete newData["manifold"];
  delete newData["metaculus"];

  // add metaforecase key
  newData["metaforecast"] = {};

  return newData;
});

/**
 * Add an overrides property to each node
 * to store collaborators overrides of squiggle variables
 */
migrations.set("3", (data: any) => {
  const newData = structuredClone(data);

  // add overrides to each node
  Object.values(newData["squiggle"]).forEach((node: any) => {
    node.overrides = {};
  });

  console.log("migrated data", newData);

  return newData;
});

export const migrate = upkeep<Schema>(migrations);
