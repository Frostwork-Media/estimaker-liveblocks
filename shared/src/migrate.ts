import { upkeep } from "object.upkeep";
import { INITIAL_STORAGE_RAW, Schema } from "./schema";

const migrations = new Map();
migrations.set("1", () => {
  return INITIAL_STORAGE_RAW;
});

// migrations.set("2", (data: object) => {
//   return {
//     ...data,
//     anotherString: "Hello World 222",
//   };
// });

export const migrate = upkeep<Schema>(migrations);
