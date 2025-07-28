// app/api/buildings/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const query = `
    [out:json];
    (
      node["natural"="tree"](40.7621,-111.8987,40.7691,-111.8830);
      way["natural"="water"](40.7621,-111.8987,40.7691,-111.8830);
      way["landuse"~"grass|forest"](40.7621,-111.8987,40.7691,-111.8830);
      way["highway"~"footway|path|pedestrian"](40.7621,-111.8987,40.7691,-111.8830);
      node["amenity"="bench"](40.7621,-111.8987,40.7691,-111.8830);
      node["highway"="street_lamp"](40.7621,-111.8987,40.7691,-111.8830);
      node["emergency"="fire_hydrant"](40.7621,-111.8987,40.7691,-111.8830);
      way["shop"](40.7621,-111.8987,40.7691,-111.8830);
      way["barrier"~"fence|hedge"](40.7621,-111.8987,40.7691,-111.8830);
      way["leisure"~"park|playground|pitch"](40.7621,-111.8987,40.7691,-111.8830);
      way["waterway"](40.7621,-111.8987,40.7691,-111.8830);
      node["highway"="bus_stop"](40.7621,-111.8987,40.7691,-111.8830);
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: query }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
