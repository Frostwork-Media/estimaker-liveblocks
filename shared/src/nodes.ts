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
};

export type ManifoldNode = {
  x: number;
  y: number;
  nodeType: "manifold";
  link: string;
};

export type MetaculusNode = {
  x: number;
  y: number;
  nodeType: "metaculus";
  link: string;
};
