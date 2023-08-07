import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Room } from "./pages/Room";
import { Home } from "./pages/Home";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/room/:id", element: <Room /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <SignedIn>
          <RouterProvider router={router} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;
