import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import Layers from "cytoscape-layers";

export const hasInit = false;

if (!hasInit) {
  cytoscape.use(Layers);
  cytoscape.use(dagre);
}

export { cytoscape };
