import { IHTMLLayer, LayersPlugin } from "cytoscape-layers";
import { cytoscape } from "./cytoscape";
import cy from "cytoscape";

export class Renderer {
  private rootElement: HTMLDivElement | null = null;
  private cy: cytoscape.Core | null = null;
  private layers: LayersPlugin | null = null;
  private nodes: IHTMLLayer | null = null;

  /** Initialize Cytoscape */
  init(root: HTMLDivElement) {
    // check if container is already initialized
    if (root.children.length > 0) {
      console.log("container already initialized");
      return;
    }

    this.rootElement = root;

    // create a new cytoscape instance
    this.cy = cytoscape({
      container: root,
      autoungrabify: true,
      // @ts-ignore
      style: `node { background-color: black; shape: rectangle; background-opacity: 0; width: data(width); height: data(height); }
      edge { width: 2; line-color: #9e9e9f; target-arrow-color: #9e9e9f; curve-style: bezier; target-arrow-shape: triangle; arrow-scale: 1.25; }
      `,
    });

    // initialize the layers plugin
    this.layers = (this.cy as any).layers() as LayersPlugin;

    // create a new HTML layer for the nodes
    this.nodes = this.layers.append("html");

    // bind the layer to the draw function
    this.layers.renderPerNode(this.nodes, Renderer.draw, {
      updateOn: "render",
      queryEachTime: true,
      uniqueElements: true,
      selector: ":childless",
      // transform: "translate3d(1px, 1px, 0px)",
    });

    return this.cy;
  }

  /**
   * Render elements
   */
  render({ nodes, edges }: cy.ElementsDefinition) {
    if (!this.cy) {
      console.log("cytoscape not initialized");
      return;
    }

    console.log("rendering", nodes.length, "nodes");

    // prerender each element to get it's size
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const { width, height } = Renderer.prerender(node);
      node.data = {
        ...node.data,
        width,
        height,
      };
    }

    // wipe the graph
    this.cy.json({ elements: [] });

    this.cy
      .json({ elements: { nodes, edges } })
      .layout({
        name: "dagre",
      })
      .run();
  }

  /**
   * Destroy the renderer
   */
  destroy() {
    if (!this.cy) return;

    this.cy.destroy();
    this.cy = null;
    this.layers = null;
    this.nodes = null;
    this.rootElement.innerHTML = "";
    this.rootElement = null;
  }

  /**
   * At some point render and prerender need to use the same draw function
   * However prerender isn't yet a qualified cy node, but rather
   * a definition. So we need to create a draw function that can
   * take just a definition. This is that function.
   */
  static drawFromDefinition(elem: HTMLElement, node: cy.NodeDefinition): void {
    // erase the div
    elem.innerHTML = "";

    // set the id
    elem.id = node.data.id;

    // add classnames
    elem.className = "";
    const classes =
      typeof node.classes === "string"
        ? node.classes.split(" ")
        : node.classes ?? [];
    elem.classList.add("node", ...classes);

    // create a div for the attribute
    const innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "label");

    // set label
    innerDiv.textContent = node.data.label ?? "";

    elem.appendChild(innerDiv);
  }

  /**
   * Given an element to draw into and the node data, draw the node
   *
   * This is like a baby javascript framework
   * */
  static draw(
    elem: HTMLElement,
    node: cy.NodeSingular,
    bb: cy.BoundingBox12 & cy.BoundingBoxWH
  ): void {
    Renderer.drawFromDefinition(elem, {
      data: node.data(),
      classes: node.classes(),
    });
  }

  /**
   * This function will take a node and render it with the draw function
   */
  static prerender(node: cy.NodeDefinition): { width: number; height: number } {
    // create a parent container
    const parent = document.createElement("div");

    // create container
    const div = document.createElement("div");

    // draw the div
    Renderer.drawFromDefinition(div, node);

    // absolute position div and parent
    parent.style.position = "absolute";
    div.style.position = "absolute";

    // add the container to the parent
    parent.appendChild(div);

    // add the parent to the body
    document.body.appendChild(parent);

    // get the size of the div (!not the parent)
    const { width, height } = div.getBoundingClientRect();

    // remove parent from the DOM
    document.body.removeChild(parent);

    // return the size
    return { width, height };
  }
}
