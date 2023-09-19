import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, ReactNode } from "react";
import { AuthWrapper } from "./AuthWrapper";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
const Profile = lazy(() => import("../pages/Profile"));
const Projects = lazy(() => import("../pages/Projects"));
const Project = lazy(() => import("../pages/Project"));
const Public = lazy(() => import("../pages/Public"));
const Home = lazy(() => import("../pages/Home"));
const Ai = lazy(() => import("../pages/Ai"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/ai",
    element: <Ai />,
  },
  {
    path: "/_/public/:project",
    element: <Public />,
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
    loader: async ({ params }) => {
      // Hit migrate endpoint to ensure data is up to date
      if (params.id) await ensureDataUpToDate(params.id);

      return null;
    },
    element: (
      <AuthOnly>
        <Project />
      </AuthOnly>
    ),
  },
]);

async function ensureDataUpToDate(projectId: string) {
  await fetch(`/api/project/migrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
    }),
  });
}

export function Router() {
  return <RouterProvider router={router} />;
}

/**
 * Log people out if they're not authenticated
 */
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
