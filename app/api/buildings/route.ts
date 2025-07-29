import { NextResponse } from 'next/server';


export async function GET() {
    const query = `
  [out:json];
  (
    way["building"](40.7538,-111.8685,40.7700,-111.8185);
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
 