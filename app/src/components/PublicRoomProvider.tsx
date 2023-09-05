import { createContext } from "react";

export const PublicRoomContext = createContext<{
  isPublic: true;
}>({
  isPublic: true,
});

export function PublicRoomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoomContext.Provider value={{ isPublic: true }}>
      {children}
    </PublicRoomContext.Provider>
  );
}
