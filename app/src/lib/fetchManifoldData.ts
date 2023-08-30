const BASE_PATH = "https://manifold.markets/api/v0/slug/";

export async function fetchManifoldData(slug: string) {
  const response = await fetch(`${BASE_PATH}${slug}`);
  const result = (await response.json()) as ManifoldResponse;
  if (result.probability) {
    return {
      probability: result.probability,
      url: result.url,
      question: result.question,
    };
  } else {
    throw new Error("No probability found");
  }
}

export interface ManifoldResponse {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  createdTime: number;
  creatorAvatarUrl: string;
  closeTime: number;
  question: string;
  tags: string[];
  url: string;
  pool: Pool;
  probability: number;
  p: number;
  totalLiquidity: number;
  outcomeType: string;
  mechanism: string;
  volume: number;
  volume24Hours: number;
  isResolved: boolean;
  lastUpdatedTime: number;
  description: string;
  textDescription: string;
}

interface Pool {
  NO: number;
  YES: number;
}
