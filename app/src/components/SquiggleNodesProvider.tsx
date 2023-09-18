import { createContext } from "react";
import { SquiggleNode } from "shared";

type SquiggleNodesContextType = {
  nodes: Record<string, SquiggleNode>;
};

export const SquiggleNodesContext = createContext<SquiggleNodesContextType>({
  nodes: {},
});

export function SquiggleNodesProvider({
  children,
  nodes,
}: {
  children: React.ReactNode;
  nodes: Record<string, SquiggleNode>;
}) {
  return (
    <SquiggleNodesContext.Provider value={{ nodes }}>
      {children}
    </SquiggleNodesContext.Provider>
  );
}
