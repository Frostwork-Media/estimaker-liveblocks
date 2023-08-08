import { useUser } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

export function AuthWrapper() {
  const user = useUser();
  if (!user) return null;
  return (
    <div className="h-screen grid grid-rows-[auto,minmax(0,1fr)]">
      <div className="flex items-center justify-start px-6 py-4">
        <Avatar user={user.user} />
      </div>
      <Outlet />
    </div>
  );
}

function Avatar({ user }: { user: ReturnType<typeof useUser>["user"] }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={user?.imageUrl}
        alt={`${user?.fullName}`}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-sm">{user?.firstName}</span>
    </div>
  );
}
