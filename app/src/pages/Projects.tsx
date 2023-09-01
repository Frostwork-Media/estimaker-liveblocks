import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLiveblocksUserId } from "@/lib/hooks";
import { StaticPageWrapper } from "@/components/StaticPageWrapper";

export interface Project {
  type: string;
  id: string;
  lastConnectionAt: string;
  createdAt: string;
  metadata: {
    name: string;
  };
}

export default function Projects() {
  const navigate = useNavigate();
  const userId = useLiveblocksUserId();
  const projects = useQuery<Project[], Error>(
    ["projects"],
    async () => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    {
      enabled: !!userId,
    }
  );

  const createProjectMutation = useMutation<{ id: string }>(
    async () => {
      const res = await fetch("/api/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    {
      onSuccess: (data) => {
        if (data.id) navigate(`/app/projects/${data.id}`);
      },
    }
  );

  return (
    <StaticPageWrapper
      pageTitle="Projects"
      description="Open a project or create a new one."
    >
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createProjectMutation.mutate();
        }}
      >
        <Button>Create a new project</Button>
      </form>
      {projects.isError && <ErrorMessage error={projects.error} />}
      {projects.isLoading ? (
        <div>Loading...</div>
      ) : projects.isSuccess && projects.data.length ? (
        <div className="grid gap-2">
          {projects.data?.map((project) => (
            <Link
              key={project.id}
              className="p-4 border rounded-md flex items-center justify-between hover:bg-neutral-100"
              to={`/project/${project.id}`}
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 rounded-md h-2 w-2" />
                <div className="text-lg">
                  {project.metadata.name ?? "Untitled"}
                </div>
              </div>
              <div className="text-sm text-neutral-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <NoProjects />
      )}
    </StaticPageWrapper>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return <div className="text-red-500">{error.message}</div>;
}

function NoProjects() {
  return (
    <div className="text-xl text-neutral-400 max-w-2xl">
      You don't have any projects yet.
    </div>
  );
}
