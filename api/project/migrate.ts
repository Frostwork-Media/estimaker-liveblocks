import { VercelApiHandler } from "@vercel/node";
import {
  deleteStorageById,
  getProjectById,
  getProjectStorage,
  setStorageById,
  updateRoomById,
} from "../_liveblocks";
import { SCHEMA_VERSION, jsonToLson, migrate } from "shared";

/**
 * This endpoint takes a project Id and makes sure the data is on the latest version.
 *
 * It doesn't return the data.
 */
const handler: VercelApiHandler = async (req, res) => {
  const projectId = req.body.projectId as string;
  if (!projectId) {
    res.status(400).json({ error: "Missing projectId" });
    return;
  }

  const room = await getProjectById(projectId);
  if (!room) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  if (room.metadata.version !== SCHEMA_VERSION) {
    const storage = await getProjectStorage(projectId);
    if (!storage) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    console.log("Migrating project", projectId);
    const [newStorage] = migrate({
      data: storage,
      version: room.metadata?.version,
    });

    // Delete current storage
    console.log("Deleting current storage");
    await deleteStorageById(projectId);

    console.log("Setting new storage");

    // Set new storage
    await setStorageById(projectId, jsonToLson(newStorage));

    // Set new version
    await updateRoomById(projectId, {
      metadata: {
        ...room.metadata,
        version: SCHEMA_VERSION,
      },
    });
  }

  res.status(200).json({ success: true });
};

export default handler;
