/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_PATH = "https://www.metaculus.com/api2/questions/";

export async function fetchMetaculusData(id: string) {
  const response = await fetch(`${BASE_PATH}${id}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  const result = (await response.json()) as MetaculusResponse;
  console.log(result);
  return null;
}

interface MetaculusResponse {
  active_state: any;
  url: string;
  page_url: string;
  id: number;
  author: number;
  author_name: string;
  title: string;
  title_short: string;
  group_label: string;
  resolution: number;
  created_time: string;
  publish_time: string;
  close_time: string;
  effected_close_time: string;
  resolve_time: string;
  possibilities: Possibilities;
  scoring: any;
  type: string;
  user_perms: any;
  weekly_movement: number;
  weekly_movement_direction: number;
  days_until_show_community_prediction: number;
  predictions_until_show_community_prediction: number;
  edited_time: string;
  last_activity_time: string;
  activity: number;
  comment_count: number;
  votes: number;
  metaculus_prediction: MetaculusPrediction;
  community_prediction: CommunityPrediction;
  number_of_forecasters: number;
  prediction_count: number;
  related_questions: RelatedQuestion[];
  group: number;
  condition: any;
  sub_questions: SubQuestion[];
  has_fan_graph: boolean;
  projects: any;
  community_absolute_log_score: number;
  metaculus_absolute_log_score: number;
  metaculus_relative_log_score: number;
  comment_count_snapshot: number;
  user_vote: number;
  user_community_vis: number;
  my_predictions: MyPredictions2;
  divergence: number;
  anon_prediction_count: number;
  description: string;
  description_html: string;
  resolution_criteria: string;
  resolution_criteria_html: string;
  fine_print: string;
  fine_print_html: string;
  user_predictions: any;
  categories: string[];
  closing_bonus: number;
  cp_hidden_period_ends_time: string;
  cp_hidden_weight_coverage: any;
  considerations: Consideration[];
  last_read: string;
  shared_with: any;
  simplified_history: any;
}

export interface Possibilities {
  property1: any;
  property2: any;
}

export interface MetaculusPrediction {
  property1: any;
  property2: any;
}

export interface CommunityPrediction {
  property1: any;
  property2: any;
}

export interface RelatedQuestion {
  active_state: any;
  url: string;
  page_url: string;
  id: number;
  author: number;
  author_name: string;
  title: string;
  title_short: string;
  group_label: string;
  resolution: number;
  created_time: string;
  publish_time: string;
  close_time: string;
  effected_close_time: string;
  resolve_time: string;
  possibilities: Possibilities2;
  type: string;
  user_perms: any;
  weekly_movement: number;
  weekly_movement_direction: number;
  days_until_show_community_prediction: number;
  predictions_until_show_community_prediction: number;
  edited_time: string;
  community_prediction: CommunityPrediction2;
}

export interface Possibilities2 {
  property1: any;
  property2: any;
}

export interface CommunityPrediction2 {
  property1: any;
  property2: any;
}

export interface SubQuestion {
  active_state: any;
  id: number;
  resolution: number;
  publish_time: string;
  close_time: string;
  effected_close_time: string;
  resolve_time: string;
  possibilities: Possibilities3;
  sub_question_label: string;
  metaculus_prediction: any;
  community_prediction: any;
  conditioned_on_resolution: number;
  title: string;
  title_short: string;
  prediction_count: number;
  created_time: string;
  scoring: any;
  closing_bonus: number;
  cp_hidden_period_ends_time: string;
  user_perms: any;
  url: string;
  my_predictions: MyPredictions;
  user_community_vis: number;
}

export interface Possibilities3 {
  property1: any;
  property2: any;
}

export interface MyPredictions {
  id: number;
  predictions: Predictions;
  points_won: number;
  user: number;
  question: number;
  active: boolean;
  log_score: number;
  absolute_log_score: number;
  coverage: number;
}

export interface Predictions {
  property1: any;
  property2: any;
}

export interface MyPredictions2 {
  id: number;
  predictions: Predictions2;
  points_won: number;
  user: number;
  question: number;
  active: boolean;
  username: string;
  log_score: number;
  absolute_log_score: number;
  coverage: number;
}

export interface Predictions2 {
  property1: any;
  property2: any;
}

export interface Consideration {
  active_state: any;
  url: string;
  page_url: string;
  id: number;
  author: number;
  author_name: string;
  title: string;
  title_short: string;
  group_label: string;
  resolution: number;
  created_time: string;
  publish_time: string;
  close_time: string;
  effected_close_time: string;
  resolve_time: string;
  possibilities: Possibilities4;
  scoring: any;
  type: string;
  user_perms: any;
  weekly_movement: number;
  weekly_movement_direction: number;
  days_until_show_community_prediction: number;
  predictions_until_show_community_prediction: number;
  edited_time: string;
  metaculus_prediction: MetaculusPrediction2;
  community_prediction: CommunityPrediction3;
  consideration_voters: number[];
  user_voted_on_consideration: boolean;
}

export interface Possibilities4 {
  property1: any;
  property2: any;
}

export interface MetaculusPrediction2 {
  property1: any;
  property2: any;
}

export interface CommunityPrediction3 {
  property1: any;
  property2: any;
}
