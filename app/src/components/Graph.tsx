import { useEffect, useMemo, useRef } from "react";
import { useStorage } from "../liveblocks.config";
import type { ElementsDefinition, EdgeDefinition } from "cytoscape";
import { cytoscape } from "../lib/cytoscape";
import { colors } from "../lib/constants";
import { SlReload } from "react-icons/sl";

import { Renderer } from "renderer";

const squiggleReservedWords = ["to"];

type NodesArray = [
  string,
  {
    readonly content: string;
    readonly variableName: string;
  }
][];

export function Graph({ userIds }: { userIds: string[] }) {
  const values = useStorage((state) => state.values);
  const nodes = useStorage((state) => state.nodes);
  const divRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core>();
  const renderer = useRef<Renderer>();
  const edges = useMemo<EdgeDefinition[]>(() => {
    if (!values || !nodes) return [];
    // from, to, userId
    const edges: EdgeDefinition[] = [];
    for (const key of values.keys()) {
      const [userId, nodeId] = key.split(":");

      const value = values.get(key);
      if (!value) continue;

      const node = nodes.get(nodeId);
      if (!node) continue;

      // read all variables from value using \w+
      const matches = value.matchAll(/([a-z]\w*)/gi);
      for (const match of matches) {
        const variableName = match[1];
        if (squiggleReservedWords.includes(variableName)) continue;
        edges.push({
          data: {
            id: `${variableName}-${node.variableName}-${userId}`,
            source: variableName,
            target: node.variableName,
          },
          classes: `user-${userIds.indexOf(userId)}`,
        });
      }
    }
    return edges;
  }, [values, nodes, userIds]);

  const nodesArray = Array.from(nodes?.entries() ?? []);
  const elements = nodesToCytoscapeElements(nodesArray, edges);

  useEffect(() => {
    if (!divRef.current) return;
    if (renderer.current) return;
    renderer.current = new Renderer();
    cyRef.current = renderer.current.init(divRef.current);
  }, []);

  useEffect(() => {
    if (!renderer.current) return;
    renderer.current.render(elements);
  }, [elements]);

  return (
    <div className="relative">
      <div
        className="rounded-md border shadow p-2 w-full h-[750px] mx-auto bg-background"
        ref={divRef}
      />
      <button
        className="absolute top-1 right-1 p-2 bg-background rounded-md border shadow"
        onClick={() => {
          if (!cyRef.current) return;
          cyRef.current.fit();
        }}
      >
        <SlReload />
      </button>
    </div>
  );
}

function nodesToCytoscapeElements(
  nodesArray: NodesArray,
  edges: EdgeDefinition[]
): ElementsDefinition {
  const elements: ElementsDefinition = { nodes: [], edges };

  for (const [, node] of nodesArray) {
    elements.nodes.push({
      data: {
        id: node.variableName,
        label: node.content,
      },
    });
  }

  return elements;
}
