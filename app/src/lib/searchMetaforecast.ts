const questionFragment = `fragment Question on Question {
  id
  url
  title
  description
  fetched
  options {
    name
    probability
    __typename
  }
  platform {
    id
    label
    __typename
  }
  qualityIndicators {
    stars
    numForecasts
    numForecasters
    volume
    spread
    sharesVolume
    openInterest
    liquidity
    tradeVolume
    __typename
  }
  visualization
}`;

const query = `query Search($input: SearchInput!) {
  result: searchQuestions(input: $input) {
    ...Question
    __typename
  }
}

${questionFragment}
`;

const singleQuestionQuery = `query Question($input: QuestionInput!) {
  result: question(input: $input) {
    ...Question
    __typename
  }
}

${questionFragment}`;

/**
 * Given a query, uses graphql to search metaforecast api
 * for a market
 *
 * Endpoint: https://metaforecast.org/api/graphql
 */
export async function searchMetaforecast(search: string) {
  const variables = getVariables(search);
  const response = await fetch("https://metaforecast.org/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables, operationName: "Search" }),
  });

  const { data } = await response.json();
  return data.result;
}

export async function getMetaforecast(questionId: string) {
  const variables = getQuestionVariables(questionId);
  const response = await fetch("https://metaforecast.org/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: singleQuestionQuery,
      variables,
      operationName: "Question",
    }),
  });

  const { data } = await response.json();
  console.log(data);
  return data.result;
}

function getVariables(query: string) {
  return {
    input: {
      query,
      starsThreshold: 2,
      forecastsThreshold: 0,
      forecastingPlatforms: [
        "betfair",
        "fantasyscotus",
        "foretold",
        "givewellopenphil",
        "goodjudgment",
        "goodjudgmentopen",
        "guesstimate",
        "infer",
        "insight",
        "kalshi",
        "manifold",
        "metaculus",
        "polymarket",
        "predictit",
        "rootclaim",
        "smarkets",
        "wildeford",
        "xrisk",
      ],
      limit: 71,
    },
  };
}

function getQuestionVariables(questionId: string) {
  return {
    input: {
      questionId,
    },
  };
}
