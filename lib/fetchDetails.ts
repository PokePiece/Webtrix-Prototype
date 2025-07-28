export interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
}

export interface OverpassWay {
  id: number;
  nodes: number[];
  tags: { [key: string]: string };
}

export interface OverpassData {
  elements: Array<{
    type: 'node' | 'way';
    id: number;
    lat?: number;
    lon?: number;
    nodes?: number[];
    tags?: { [key: string]: string };
  }>;
}

export async function fetchDetails(): Promise<{
  details: {
    id: number;
    coords: [number, number][];
    tags: { [key: string]: string };
    type: 'node' | 'way';
  }[];
}> {
  const res = await fetch("/api/details");
  const data: OverpassData = await res.json();

  const nodeMap = new Map<number, [number, number]>();
  const details: {
    id: number;
    coords: [number, number][];
    tags: { [key: string]: string };
    type: 'node' | 'way';
  }[] = [];

  // Populate node map for nodes with lat/lon
  for (const el of data.elements) {
    if (el.type === "node" && el.lat !== undefined && el.lon !== undefined) {
      nodeMap.set(el.id, [el.lon, el.lat]);
    }
  }

  // Process all elements, separate handling for nodes and ways
  for (const el of data.elements) {
    if (el.type === "node" && el.lat !== undefined && el.lon !== undefined) {
      details.push({
        id: el.id,
        coords: [[el.lon, el.lat]],
        tags: el.tags || {},
        type: "node",
      });
    } else if (el.type === "way" && el.nodes) {
      const coords: [number, number][] = [];
      for (const nodeId of el.nodes) {
        const pt = nodeMap.get(nodeId);
        if (pt) coords.push(pt);
      }
      if (coords.length > 1) { // ways usually have at least 2 points
        details.push({
          id: el.id,
          coords,
          tags: el.tags || {},
          type: "way",
        });
      }
    }
  }

  console.log("Enriched details:", details);

  return { details };
}
