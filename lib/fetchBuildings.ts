export interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
}

import { buildingMetadata } from './buildingMetadata'

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
  buildings: {
    id: number
    coords: [number, number][]
    height: number
    name?: string
    type?: string
    amenity?: string
    address?: string
    wikidata?: string
    wikipedia?: string
    website?: string
  }[]
}> {
  const res = await fetch("/api/buildings");
  const data: OverpassData = await res.json();

  const nodeMap = new Map<number, [number, number]>();
  const ways: {
    id: number
    coords: [number, number][]
    height: number
    name?: string
    type?: string
    amenity?: string
    address?: string
    wikidata?: string
    wikipedia?: string
    website?: string
  }[] = []


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
      if (coords.length > 2) {
        const heightStr = el.tags?.height
        const levelsStr = el.tags?.["building:levels"]
        let height = 10 // default fallback

        if (heightStr) {
          const parsed = parseFloat(heightStr)
          if (!isNaN(parsed)) height = parsed
        } else if (levelsStr) {
          const parsed = parseInt(levelsStr)
          if (!isNaN(parsed)) height = parsed * 3 // assume 3m per level
        }

        const metadata = buildingMetadata[el.id];
        if (metadata) {
          if (metadata.name) el.tags = { ...el.tags, name: metadata.name };
          if (metadata.website) el.tags = { ...el.tags, website: metadata.website };
          if (metadata.address) el.tags = { ...el.tags, ["addr:full"]: metadata.address };
          // Extend as needed for other fields
        }


        ways.push({
          id: el.id,
          coords,
          height,
          name: el.tags?.name,
          type: el.tags?.building,
          amenity: el.tags?.amenity,
          address: el.tags?.["addr:full"] || el.tags?.["addr:street"],
          wikidata: el.tags?.wikidata,
          wikipedia: el.tags?.wikipedia,
          website: el.tags?.website,
        })

      }

    }
  }

  console.log("Enriched buildings:", ways);


  return { buildings: ways };
}
