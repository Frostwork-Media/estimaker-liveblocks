import { PublicGraph } from "@/components/graphs/PublicGraph";
import { PublicStoreContext, createPublicStore } from "@/lib/usePublicStore";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { PublicProject } from "shared";

export default function Public() {
  const { user, project } = useParams<{ user: string; project: string }>();
  if (!user || !project) throw new Error("Missing params");
  // query for the public project
  const publicProject = useQuery<PublicProject>(
    ["publicProject", user, project],
    async () => {
      const search = new URLSearchParams();
      search.set("user", user);
      search.set("project", project);

      const res = await fetch(`/api/public?${search.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch public project");
      return res.json();
    },
    {
      enabled: !!user && !!project,
      suspense: true,
    }
  );

  if (!publicProject.data) throw new Error("Missing public project");

  // Create a store for the public project
  const store = useRef(createPublicStore(publicProject.data)).current;

  return (
    <PublicStoreContext.Provider value={store}>
      <div className="h-screen w-full">
        <PublicGraph
          nodes={publicProject.data.storage.data.nodes.data}
          suggestedEdges={publicProject.data.storage.data.suggestedEdges.data}
        />
      </div>
    </PublicStoreContext.Provider>
  );
}
