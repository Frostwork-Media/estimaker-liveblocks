import { createContext, useContext } from "react";
import { PublicProject } from "shared";
import { create, useStore } from "zustand";

export const createPublicStore = (initialState: PublicProject) => {
  return create<PublicProject>()((_set) => initialState);
};

export type PublicStore = ReturnType<typeof createPublicStore>;

export const PublicStoreContext = createContext<PublicStore | null>(null);

export const usePublicStoreOrThrow = (
  selector: (state: PublicProject) => any
) => {
  const store = useContext(PublicStoreContext);
  if (!store) throw new Error("Missing PublicStore.Provider in the tree");
  return useStore(store, selector);
};
