export type SquiggleNode = {
  x: number;
  y: number;
  nodeType: "squiggle";
  content: string;
  variableName: string;
  value: string;
  showing?: "graph";
  /** An HSL interior string that can be used to style text or edges */
  color?: string;
  /** Overrides from individual collaborators. The key is the collaborators name and the value is the value */
  overrides: { [key: string]: string };
};

export type MetaforecastNode = {
  x: number;
  y: number;
  nodeType: "metaforecast";
  link: string;
};

export type NodeTypes = SquiggleNode["nodeType"] | MetaforecastNode["nodeType"];
