# Webtrix - Stylized 3D Web Map Demo

This is an early-stage prototype of a lightweight 3D spatial web experience built with React Three Fiber and Next.js.

## Overview

The project visualizes local sites as stylized 3D objects on a simplified map. It includes:

- A minimal map plane with color-coded 3D "buildings" representing points of interest.
- A simple user avatar rendered as a capsule and sphere.
- Basic keyboard controls (WASD / arrow keys) for avatar movement.
- Interactive 3D scene managed via Three.js in React.

This demo showcases core foundational elements for a spatial web interface designed for exploration and interaction.

## Tech Stack

- Next.js with the `/app` directory and React 18.
- React Three Fiber (`@react-three/fiber`) for WebGL rendering.
- Drei (`@react-three/drei`) for helpers (e.g. orbit controls).
- Tailwind CSS for utility-first styling.

## Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Open the app in the browser and use WASD or arrow keys to move the avatar.

## Next Steps (Planned)

- Camera following the avatar
- More detailed avatar models and animations
- Interactive buildings linked to real web content
- Map data integration and GPS support

---

This repository is an early work in progress. Contributions and feedback are welcome!

