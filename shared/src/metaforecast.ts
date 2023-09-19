/**
 * We only store the id in metaforecast so we can look it up as needed,
 * in case it changes as time goes by.
 */
export type MetaforecastData = {
  metaforecastId: string;
};

export interface MetaforecastResponse {
  __typename: string;
  id: string;
  url: string;
  title: string;
  description: string;
  fetched: number;
  options: Option[];
  platform: Platform;
  qualityIndicators: QualityIndicators;
  visualization: any;
}

export interface Option {
  name: string;
  probability: number;
  __typename: string;
}

export type PlatformId =
  | "metaculus"
  | "kalshi"
  | "goodjudgmentopen"
  | "manifold"
  | "givewellopenphil"
  | "rootclaim"
  | "wildeford"
  | "insight"
  | "polymarket"
  | "xrisk"
  | "smarkets"
  | "infer";

export interface Platform {
  id: PlatformId;
  label: string;
  __typename: string;
}

export interface QualityIndicators {
  stars: number;
  numForecasts?: number;
  numForecasters?: number;
  volume: any;
  spread?: number;
  sharesVolume?: number;
  openInterest: any;
  liquidity: any;
  tradeVolume: any;
  __typename: string;
}
