import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-screen p-6">
      <div className="max-w-4xl mx-auto w-full grid gap-6 content-start">
        <h1 className="text-5xl font-bold">Projects</h1>
        <p>We need to list the projects that the user has in here.</p>
        <p>Let's assume that our projects are always stored in a</p>
        <ul>
          <li>This is a project link</li>
        </ul>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const roomName = formData.get("roomName");
            if (!(typeof roomName === "string")) return;

            // slugify it
            const slug = roomName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "");

            // go there
            navigate(`/room/${slug}`);
          }}
        >
          <input
            type="text"
            className="border-2 border-neutral-300 rounded-md p-2"
            name="roomName"
          />
          <button className="bg-blue-500 text-background rounded-md p-2">
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}
