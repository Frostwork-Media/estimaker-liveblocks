import { Link } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { SmallSpinner } from "../components/SmallSpinner";
import { BiUser } from "react-icons/bi";

export default function Home() {
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
            <SignInButton
              afterSignInUrl="/app/projects"
              afterSignUpUrl="/app/projects"
            >
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
