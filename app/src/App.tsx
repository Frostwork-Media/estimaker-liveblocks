import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Router } from "./components/Router";
import { LargeSpinner } from "./components/SmallSpinner";

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <TooltipProvider>
          <Suspense
            fallback={
              <div className="h-screen flex justify-center items-center">
                <LargeSpinner />
              </div>
            }
          >
            <Router />
          </Suspense>
        </TooltipProvider>
      </ClerkProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
