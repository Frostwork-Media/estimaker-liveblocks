import { VercelRequest, VercelResponse } from "@vercel/node";
import { testExport } from "../shared";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  res.status(200).send("The shared value is: " + testExport);
};

export default handler;
