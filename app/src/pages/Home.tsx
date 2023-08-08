import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";

export interface Project {
  type: string;
  id: string;
  lastConnectionAt: string;
  createdAt: string;
}

export function Home() {
  const navigate = useNavigate();
  const userId = useUser().user?.id;
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
        if (data.id) navigate(`/projects/${data.id}`);
      },
    }
  );
  return (
    <div className="h-screen p-6 py-10">
      <div className="max-w-4xl mx-auto w-full grid gap-5 content-start">
        <h1 className="text-5xl font-bold">Projects</h1>
        <p className="text-xl text-neutral-400 max-w-2xl">
          Open a project or create a new one.
        </p>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createProjectMutation.mutate();
          }}
        >
          <button className="bg-blue-600 text-background rounded-md py-2 px-4 font-bold">
            Create a new project
          </button>
        </form>
        {projects.isError && <ErrorMessage error={projects.error} />}
        {projects.isLoading && <div>Loading...</div>}
        {projects.isSuccess && (
          <div className="grid gap-2">
            {projects.data?.map((project) => (
              <Link
                key={project.id}
                className="p-4 border rounded-md flex items-center justify-between hover:bg-neutral-100"
                to={`/projects/${project.id}`}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded-md h-2 w-2" />
                  <div className="text-lg font-bold">{project.id}</div>
                </div>
                <div className="text-sm text-neutral-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return <div className="text-red-500">{error.message}</div>;
}
