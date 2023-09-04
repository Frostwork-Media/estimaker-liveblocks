import { getProjectBySlug, getProjectStorage } from "./_liveblocks";

import { VercelApiHandler } from "@vercel/node";

const handler: VercelApiHandler = async (req, res) => {
  // get user and project query params
  const user = req.query.user;
  const slug = req.query.project;

  if (!user || !slug || Array.isArray(user) || Array.isArray(slug)) {
    res.status(400).send("Invalid query params");
    return;
  }

  // Look up the project
  const project = await getProjectBySlug(slug);
  if (!project) {
    res.status(404).send("Project not found");
    return;
  }

  // Confirm the project is marked as public
  if (project.metadata.public !== "true") {
    res.status(404).send("Project not found");
    return;
  }

  // Get project storage
  const storage = await getProjectStorage(project.id);
  if (!storage) {
    res.status(500).send("Error getting project");
    return;
  }

  // Return the metadata and storage
  // Cache the response for 1 hour
  res.setHeader("Cache-Control", "s-maxage=3600");
  res.status(200).json({
    metadata: project.metadata,
    storage: storage,
  });
};

export default handler;
