import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Project } from "./pages/Project";
import { Home } from "./pages/Home";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthWrapper } from "./components/AuthWrapper";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWrapper />,
    children: [{ element: <Home />, index: true }],
  },
  { path: "/projects/:id", element: <Project /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <TooltipProvider>
          <SignedIn>
            <RouterProvider router={router} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </TooltipProvider>
      </ClerkProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
