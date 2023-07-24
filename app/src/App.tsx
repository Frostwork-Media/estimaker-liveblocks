import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Room } from "./pages/Room";
import { Home } from "./pages/Home";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

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
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
