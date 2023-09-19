import { SmallSpinner } from "@/components/SmallSpinner";
import { StaticPageWrapper } from "@/components/StaticPageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserMetadata } from "@/lib/hooks";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BiSave, BiSolidErrorCircle } from "react-icons/bi";
import { UserInfo } from "shared";

export default function Profile() {
  const userMetadata = useUserMetadata();

  return (
    <StaticPageWrapper pageTitle="Profile" description="Edit your profile">
      <section className="grid border rounded-lg p-4 shadow">
        <h2 className="text-2xl">Username</h2>
        <p className="text-neutral-400 max-w-2xl">
          Your username is how other people will identify you on the platform.
        </p>
        <p className="text-sm my-4">
          <BiSolidErrorCircle className="w-4 h-4 inline -mt-px" /> Note Changing
          your username will also change the URL to any public project you own.
        </p>
        {/* Add a note that changing the username will change the url to any public project */}
        <div className="mt-2 grid gap-1">
          <span className="text-xs text-neutral-400">
            Use only alphanumeric characters and underscores
          </span>
          <SetUsernameForm
            username={userMetadata.data?.username}
            isLoading={userMetadata.isLoading}
          />
        </div>
      </section>
      {/* <section className="grid border rounded-lg p-4 shadow mt-4">
        <h2 className="text-2xl">Delete Account</h2>
        <p className="text-neutral-400 max-w-2xl">
          Deleting your account will permanently delete all of your projects and
          data.
        </p>
        <div className="flex gap-2 items-center mt-4">
          <Button
            variant="destructive"
            onClick={() => {
              window.alert("Sorry, this is not implemented yet!");
            }}
          >
            Delete Account
          </Button>
        </div>
      </section> */}
    </StaticPageWrapper>
  );
}

function SetUsernameForm({
  username = "",
  isLoading,
}: {
  username?: string;
  isLoading: boolean;
}) {
  const [current, setCurrent] = useState(username);
  const updateUsernameMutation = useMutation(
    async (username: string) => {
      if (!username) {
        throw new Error("Username cannot be empty");
      }

      const result = await fetch("/api/user/set-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }).then((res) => res.json());

      if (result.error) {
        throw new Error(result.error);
      }

      return result as UserInfo;
    },
    {
      onSuccess: (userMetadata) => {
        // Update the user metadata in the cache
        queryClient.setQueryData(["user-metadata"], userMetadata);
      },
    }
  );

  /**
   * If the username changes, update the current username
   */
  useEffect(() => {
    setCurrent(username);
  }, [username]);

  return (
    <form
      className="flex gap-2 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        updateUsernameMutation.mutate(current);
      }}
    >
      <Input
        placeholder="Username"
        id="username"
        name="username"
        required
        value={current}
        disabled={isLoading}
        /**
         * Only allow inserting alphanumeric characters and underscores
         * by replacing any non-alphanumeric characters with an empty string
         * and making all characters lowercase
         */
        onChange={(e) => {
          setCurrent(
            e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()
          );
        }}
        /**
         * max width of 32 characters
         */
        maxLength={32}
      />
      <Button disabled={current === username || isLoading || !current.length}>
        <div className="inline mr-2">
          {updateUsernameMutation.isLoading ? (
            <SmallSpinner />
          ) : (
            <BiSave className="w-4 h-4" />
          )}
        </div>
        Save
      </Button>
    </form>
  );
}
