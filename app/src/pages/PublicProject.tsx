import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function PublicProject() {
  const { user, project } = useParams<{ user: string; project: string }>();
  if (!user || !project) throw new Error("Missing params");
  // query for the public project
  const publicProject = useQuery(
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
    }
  );

  console.log(publicProject.data);

  return (
    <div>
      <h1>{user}</h1>
      <h1>{project}</h1>
      {JSON.stringify(publicProject.data)}
    </div>
  );
}
