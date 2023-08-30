import { VercelApiHandler } from "@vercel/node";
import { METACULUS_API_KEY } from "./_config";

const BASE_PATH = "https://www.metaculus.com/api2/questions";
/**
 * Proxy requests to the metaculus api
 */
const handler: VercelApiHandler = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).send("Missing id");
    return;
  }

  const data = await fetchMetaculusData(id);
  res.status(200).json(data);
};

export default handler;

async function fetchMetaculusData(id: string) {
  const url = `${BASE_PATH}/${id}/`;
  const response = await fetch(url, {
    headers: {
      Authorization: METACULUS_API_KEY,
    },
  });
  return response.json();
}
