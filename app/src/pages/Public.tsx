import { PublicGraph } from "@/components/PublicGraph";
import { PROJECT_HEADER_STYLES } from "@/lib/sharedProjectStyles";
import { PublicStoreContext, createPublicStore } from "@/lib/usePublicStore";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { PublicProject } from "shared";

export default function Public() {
  const { project } = useParams<{ user: string; project: string }>();
  if (!project) throw new Error("Missing params");
  // query for the public project
  const publicProject = useQuery<PublicProject>(
    ["publicProject", project],
    async () => {
      const search = new URLSearchParams();
      search.set("project", project);

      const res = await fetch(`/api/public?${search.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch public project");
      const data = (await res.json()) as PublicProject;
      return data;
    },
    {
      enabled: !!project,
      suspense: true,
    }
  );

  if (!publicProject.data) throw new Error("Missing public project");

  // Create a store for the public project
  const store = useRef(createPublicStore(publicProject.data)).current;

  return (
    <PublicStoreContext.Provider value={store}>
      <div className="h-screen w-full grid grid-rows-[auto_minmax(0,1fr)]">
        <header className={classNames(PROJECT_HEADER_STYLES, "py-2")}>
          <h1 className="text-xl">{publicProject.data.metadata.name}</h1>
        </header>
        <PublicGraph
          nodes={publicProject.data.storage.data.nodes.data}
          suggestedEdges={publicProject.data.storage.data.suggestedEdges.data}
        />
      </div>
    </PublicStoreContext.Provider>
  );
}
