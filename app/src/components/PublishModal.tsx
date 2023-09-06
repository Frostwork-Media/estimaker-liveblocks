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
import { useRoomMetadata } from "@/lib/hooks";
import { SmallSpinner } from "./SmallSpinner";
import { Input } from "./ui/input";
import { queryClient } from "@/lib/queryClient";
import { WorldSvg } from "./WorldSvg";
import classNames from "classnames";
import { BiRightArrowAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

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
      })
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        });

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
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

  const slugOnServer = roomMetadataQuery.data?.slug;
  const [slug, setSlug] = useState(slugOnServer);
  useEffect(() => {
    setSlug(slugOnServer);
  }, [slugOnServer]);

  const updateSlugMutation = useMutation<string, Error>(
    async () => {
      if (!room.id) return "";

      const response = await fetch("/api/project/update-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: room.id, slug }),
      }).then((res) => res.json());

      if ("error" in response) {
        throw new Error(response.error);
      }

      // return updatedRoomMetadata;
      return response;
    },
    {
      onSuccess: (metadata) => {
        // Set this metadata in the cache
        queryClient.setQueryData(["metadata", room.id], metadata);
      },
    }
  );

  const isPublic = roomMetadataQuery.data?.public === "true";

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
        <div className="grid gap-4">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-bold">Publish</h3>
          </div>
          <p className="text-sm text-gray-500">
            Make your project publically available?
          </p>
          {roomMetadataQuery.isLoading || !roomMetadataQuery.data ? (
            <SmallSpinner />
          ) : (
            <div className="gap-4 grid">
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
              {isPublic ? (
                <>
                  <div className="grid gap-1">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      value={slug}
                      onChange={(e) => {
                        const validSlug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/-+/g, "-");

                        setSlug(validSlug);
                      }}
                      id="slug"
                      /** Trigger mutation on enter */
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateSlugMutation.mutate();
                        }
                      }}
                    />
                    {slug !== slugOnServer ? (
                      <Button
                        onClick={() => {
                          updateSlugMutation.mutate();
                        }}
                      >
                        <div className="mr-2">
                          {updateSlugMutation.isLoading ? (
                            <SmallSpinner />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </div>
                        Update Slug
                      </Button>
                    ) : null}
                    {updateSlugMutation.isError && (
                      <p className="text-red-500 text-sm text-center">
                        {updateSlugMutation.error.message}
                      </p>
                    )}
                  </div>
                  <hr />
                </>
              ) : null}
            </div>
          )}
          <PublicLink slug={roomMetadataQuery.data?.slug || ""} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PublicLink({ slug }: { slug: string }) {
  if (!slug) return null;
  return (
    <Button variant="secondary" asChild>
      <a href={`/_/public/${slug}`} target="_blank" rel="noreferrer">
        Visit Public Page
        <BiRightArrowAlt className="inline -mt-px w-4 h-4" />
      </a>
    </Button>
  );
}
