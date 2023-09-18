import { VercelApiHandler } from "@vercel/node";

type Node = {
  content: string;
  variableName: string;
  value: string;
  manifold?: string;
};

const handler: VercelApiHandler = async (req, res) => {
  const code = req.body.code;
  if (!code) {
    res.status(400).json({ error: "No code provided" });
    return;
  }

  // Send that code to OpenAI to be converted into JSON project format
  // Return that to the frontend
  // On the frontend we will, walk through the JSON creating relevant lson types
  // Then we will turn it into plain lson, and hit another project creation endpoint
  // with our initial storage. We can probably reuse our new project endpoint for that purpose
};

export default handler;

const EXAMPLE_INPUT = `// percentage of Americans identifying as democratic socialists or supporting their policies
percentageDemocraticSocialistSupport = 0.1 to 0.3

// number of presidential elections between now and 2050
numberOfElections = 7 to 8

// probability of a democratic socialist winning the Democratic primary
probabilityWinningPrimary = 0.1 to 0.3

// probability of a democratic socialist winning the general election after winning the primary
probabilityWinningGeneral = 0.4 to 0.6

// probability of a democratic socialist winning a single election
probabilitySingleElection = probabilityWinningPrimary * probabilityWinningGeneral

// probability of not winning any election
probabilityNotWinningAnyElection = (1 - probabilitySingleElection) ^ numberOfElections

// final probability of America electing a democratic socialist as president before 2050
response = 1 - probabilityNotWinningAnyElection`;

const ALTERNATIVE_INPUT = `/*
A CEA for policy advocacy for banning pesticides used to commit suicide
*/

suicidereductionUK = 1 to 4 // estimated number of suicides averted in the UK after CO was removed from the gas supply, as a multiple of the annual suicide rate
generalizabilitydiscount = 0.2 to 1.2 // CO suicides made up 40% of the UK total before its removal. Target countries could have higher or lower rates of pesticide suicides. There are further reasons why the UK results would not fully generalize.
suiciderate = 40 to 230 // for all countries, the rate per million has 5th, 95th percentiles 2.3 and 23. Assume the low-rate countries would not be targeted
population = 10 to 300 // population of target country, millions
suicidesaverted = suicidereductionUK*generalizabilitydiscount*suiciderate*population

advocacyannualcost = 100000 to 200000
advocacydurationunsuccessful = 1 to 3
advocacydurationsuccessful = 1.5 to 5
successprobability = beta(1,9)
cost  = advocacyannualcost*(successprobability*advocacydurationsuccessful+(1-successprobability)*advocacydurationunsuccessful)

suicidesavertedperUSD1000 = 1000*suicidesaverted/cost

lifeyearspersuicideaverted = 10 to 38
dalysperlifeyear = truncateRight(0.5 to 0.9,0.9)
wellbysperlifeyear = truncateRight((1.5 to 8)-2,9)

dalysperusd1000 = suicidesavertedperUSD1000*lifeyearspersuicideaverted*dalysperlifeyear

wellbysperusd1000 = suicidesavertedperUSD1000*lifeyearspersuicideaverted*wellbysperlifeyear`;

const prompt = `The following code is written in a programming language for intuitive probabilistic estimation. Please convert the declarations into graph nodes. Use comments`;
