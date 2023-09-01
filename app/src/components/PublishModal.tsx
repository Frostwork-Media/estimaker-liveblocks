import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRoom } from "@/liveblocks.config";
import { useRoomMetadata, useUserMetadata } from "@/lib/hooks";
import { SmallSpinner } from "./SmallSpinner";
import { Input } from "./ui/input";
import { queryClient } from "@/lib/queryClient";
import { WorldSvg } from "./WorldSvg";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";

export function PublishModal() {
  const room = useRoom();
  const roomMetadataQuery = useRoomMetadata(room.id);
  const makePublicMutation = useMutation(
    async () => {
      if (!room.id) return;
      const response = await fetch("/api/make-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: room.id }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const updatedRoomMetadata = await response.json();
      return updatedRoomMetadata;
    },
    {
      onSuccess: (updatedRoomMetadata) => {
        // Set this metadata in the cache
        queryClient.setQueryData(["metadata", room.id], updatedRoomMetadata);
      },
    }
  );

  const makeNotPublicMutation = useMutation(
    async () => {
      if (!room.id) return;
      const response = await fetch("/api/make-not-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: room.id }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const updatedRoomMetadata = await response.json();
      return updatedRoomMetadata;
    },
    {
      onSuccess: (updatedRoomMetadata) => {
        // Set this metadata in the cache
        queryClient.setQueryData(["metadata", room.id], updatedRoomMetadata);
      },
    }
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className={classNames(
            {
              "bg-blue-100 hover:bg-blue-200":
                roomMetadataQuery.data?.public === "true",
            },
            "transition-colors duration-1000"
          )}
        >
          <WorldSvg isPublic={roomMetadataQuery.data?.public === "true"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="grid gap-3">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-bold">Publish</h3>
          </div>
          <p className="text-sm text-gray-500">
            Make your project publically available?
          </p>
          {roomMetadataQuery.isLoading || !roomMetadataQuery.data ? (
            <SmallSpinner />
          ) : (
            <div className="gap-6 grid">
              <div className="flex items-center gap-2">
                <Switch
                  id="publish"
                  checked={roomMetadataQuery.data.public === "true"}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      makePublicMutation.mutate();
                    } else {
                      makeNotPublicMutation.mutate();
                    }
                  }}
                />
                <Label htmlFor="publish">Publish</Label>
                {(makePublicMutation.isLoading ||
                  makeNotPublicMutation.isLoading) && <SmallSpinner />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input defaultValue={roomMetadataQuery.data.slug} id="slug" />
              </div>
            </div>
          )}
          <PublicLink slug={roomMetadataQuery.data?.slug || ""} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PublicLink({ slug }: { slug: string }) {
  const userMetadata = useUserMetadata();
  if (userMetadata.isLoading) return <SmallSpinner />;
  if (!slug) return null;
  if (!userMetadata.data?.username) {
    return (
      <Link className="text-xs underline text-blue-500" to="/app/profile">
        Don't forget to set a username!
      </Link>
    );
  }
  return (
    <a
      href={`/_/${userMetadata.data.username}/${slug}`}
      className="text-xs text-blue-500"
      target="_blank"
      rel="noreferrer"
    >
      View Public Page
      <BiRightArrowAlt className="inline -mt-px w-4 h-4" />
    </a>
  );
}
