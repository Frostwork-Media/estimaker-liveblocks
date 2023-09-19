import { NodeProps } from "reactflow";
import { EditableLink } from "./EditableLink";
import { useMutation, useStorage } from "@/liveblocks.config";
import { useQuery } from "@tanstack/react-query";
import { fetchManifoldData } from "@/lib/fetchManifoldData";
import { MarketLink } from "./MarketLink";
import classNames from "classnames";
import { customNodeWidthClass } from "@/lib/constants";
import { ReactNode } from "react";

export function ManifoldNode(props: NodeProps<{ link: string }>) {
  const link = useStorage((state) => state.manifold[props.id]?.link);

  const updateLink = useMutation(
    ({ storage }, value: string) => {
      storage.get("manifold").get(props.id).set("link", value);
    },
    [props.id]
  );

  /** Removes the link */
  const removeLink = useMutation(
    ({ storage }) => {
      storage.get("manifold").get(props.id).set("link", "");
    },
    [props.id]
  );

  const manifoldQuery = useManifoldQuery(link);

  return (
    <Wrapper>
      <EditableLink
        title="Manifold Markets"
        description="Enter the slug of the market you want to link to."
        placeholder="will-the-lk99-room-temp-ambient-pre"
        currentValue={link}
        save={updateLink}
        clear={removeLink}
      />
      {link ? (
        <MarketLink
          isLoading={manifoldQuery.isLoading}
          url={manifoldQuery.data?.url}
          title={manifoldQuery.data?.question}
          probability={manifoldQuery.data?.probability}
          error={!!manifoldQuery.error}
          community="Manifold"
        />
      ) : null}
    </Wrapper>
  );
}

export function PublicManifoldNode(props: NodeProps<{ link: string }>) {
  const manifoldQuery = useManifoldQuery(props.data.link);
  if (!props.data.link) return null;
  return (
    <Wrapper>
      <MarketLink
        isLoading={manifoldQuery.isLoading}
        url={manifoldQuery.data?.url}
        title={manifoldQuery.data?.question}
        probability={manifoldQuery.data?.probability}
        error={!!manifoldQuery.error}
        community="Manifold"
      />
    </Wrapper>
  );
}

function useManifoldQuery(link?: string) {
  return useQuery(
    ["manifold", link],
    () => {
      if (link) return fetchManifoldData(link);
    },
    {
      enabled: !!link,
      // Refetch every 10 minutes
      refetchInterval: 10 * 60 * 1000,
    }
  );
}

function Wrapper(props: { children: ReactNode }) {
  return (
    <div
      className={classNames(
        "p-2 border rounded shadow-sm bg-white grid gap-2",
        customNodeWidthClass
      )}
    >
      {props.children}
    </div>
  );
}
