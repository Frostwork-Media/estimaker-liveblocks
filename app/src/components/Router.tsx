import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { lazy, ReactNode } from "react";
import { AuthWrapper } from "./AuthWrapper";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { SmallSpinner } from "./SmallSpinner";
import { BiUser } from "react-icons/bi";
const Profile = lazy(() => import("../pages/Profile"));
const Projects = lazy(() => import("../pages/Projects"));
const Project = lazy(() => import("../pages/Project"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: (
      <AuthOnly>
        <AuthWrapper />
      </AuthOnly>
    ),
    children: [
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/project/:id",
    element: (
      <AuthOnly>
        <Project />
      </AuthOnly>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="grid gap-2 justify-items-center">
        <h1 className="text-3xl">Estimaker</h1>
        {!isLoaded ? (
          <SmallSpinner />
        ) : isSignedIn ? (
          <Button asChild>
            <Link to="/app/projects">Go to Projects</Link>
          </Button>
        ) : (
          <Button asChild className="cursor-pointer">
            <SignInButton>
              <div className="flex">
                <BiUser className="w-4 h-4 mr-2" />
                Sign In
              </div>
            </SignInButton>
          </Button>
        )}
      </div>
    </div>
  );
}

function AuthOnly({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn
          afterSignInUrl="/app/projects"
          afterSignUpUrl="/app/projects"
        />
      </SignedOut>
    </>
  );
}
