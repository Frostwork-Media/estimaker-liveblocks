import { useUser, SignOutButton } from "@clerk/clerk-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiFolder, BiLogOut, BiMenu, BiUser } from "react-icons/bi";
import { Button } from "./ui/button";
import { Suspense } from "react";
import { LargeSpinner } from "./SmallSpinner";

export function AuthWrapper() {
  const user = useUser();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <div className="h-screen grid grid-rows-[auto,minmax(0,1fr)]">
      <div className="flex items-center justify-start p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <BiMenu className="w-6 h-6" />
            </Button>
            {/* <Avatar user={user.user} /> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            <DropdownMenuItem asChild>
              <Link to="/app/projects">
                <BiFolder className="w-4 h-4 mr-2" />
                Projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/profile">
                <BiUser className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton
                signOutCallback={() => {
                  navigate("/");
                }}
              >
                <div className="flex">
                  <BiLogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </div>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <LargeSpinner />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}

// const _Avatar = forwardRef<
//   HTMLDivElement,
//   { user: ReturnType<typeof useUser>["user"] }
// >(({ user }, ref) => {
//   return (
//     <div
//       className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg"
//       ref={ref}
//     >
//       <img
//         src={user?.imageUrl}
//         alt={`${user?.fullName}`}
//         className="w-6 h-6 rounded-full"
//       />
//       <span className="text-sm">{user?.firstName}</span>
//     </div>
//   );
// });
