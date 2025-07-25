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

export async function fetchBuildingData(): Promise<{
  buildings: { coords: [number, number][] }[];
}> {
  const res = await fetch("/api/buildings");
  const data: OverpassData = await res.json();

  const nodeMap = new Map<number, [number, number]>();
  const ways: { coords: [number, number][] }[] = [];

  // Populate node map
  for (const el of data.elements) {
    if (el.type === "node" && el.lat && el.lon) {
      nodeMap.set(el.id, [el.lon, el.lat]);
    }
  }

  // Extract building outlines
  for (const el of data.elements) {
    if (el.type === "way" && el.nodes) {
      const coords: [number, number][] = [];
      for (const nodeId of el.nodes) {
        const pt = nodeMap.get(nodeId);
        if (pt) coords.push(pt);
      }
      if (coords.length > 2) ways.push({ coords });
    }
  }

  return { buildings: ways };
}
