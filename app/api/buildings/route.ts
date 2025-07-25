// app/api/buildings/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const query = `
    [out:json];
    (
      way["building"](40.7621,-111.8987,40.7691,-111.8830);
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
