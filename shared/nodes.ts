export type BaseNode = {
  nodeType: string;
  x: number;
  y: number;
};

export type SquiggleNode = BaseNode & {
  nodeType: "squiggle";
  content: string;
  variableName: string;
  value: string;
  showing?: "graph";
  /** An HSL interior string that can be used to style text or edges */
  color?: string;
  /** Link to a manifold market user/slug */
  manifold?: string;
  /** Link to a metaculus question id */
  metaculus?: string;
};

export type ManifoldNode = BaseNode & {
  nodeType: "manifold";
  link: string;
};

export type MetaculusNode = BaseNode & {
  nodeType: "metaculus";
  link: string;
};

export type AnyNode = SquiggleNode | ManifoldNode | MetaculusNode;
