export const buildingMetadata: Record<number, {
  name?: string;
  website?: string;
  address?: string;
  webspace?: string; // NEW
}> = {
  33193213: {
    name: "US Bank",
    website: "https://www.usbank.com/",
    address: "230 S 500 E, Salt Lake City, UT 84102",
    webspace: "https:www.usbank.com"
  },
  1147771471: {
    name: "Liberty Apartments",
    website: "http://localhost:3001",
    webspace: "http://localhost:3001" // example
  },
  995054717: {
    webspace: "https://google.com"
  }
};
