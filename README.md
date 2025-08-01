# Webtrix - The Web as a World

**Webtrix** is an evolving 3D spatial interface for the web—part stylized map, part immersive OS, part AI-native reality layer. It merges real-world locations with interactive web experiences through a physics-enabled, multiplayer-capable environment. Built with React Three Fiber and Next.js, it transforms sites, services, and intelligence nodes into manipulable 3D objects.

---

## 🌐 Overview

Webtrix is grounded in two layers:

- **The Physical Capital**: Anchored to real-world geography (starting in Salt Lake City), it maps physical services and technologies to real coordinates and buildings.
- **The Webspace Capital**: A floating, abstract dimensional layer where digital-only entities (AI blueprints, logic clusters, simulations) reside. Portals link both layers.

Webtrix allows you to:

- Walk through a 3D web interface.
- Interact with real services via physicalized representations.
- Place, harvest, craft, and upgrade web-native tools and knowledge.
- Represent Python, C++, and JS services as 3D nodes, either as active services or JS-based simulations.

---

## 🛠️ Tech Stack

- **Next.js** (`/app` directory)
- **React Three Fiber** (`@react-three/fiber`) – 3D rendering
- **Drei** (`@react-three/drei`) – helpers (controls, text, etc.)
- **@react-three/rapier** – physics engine
- **Tailwind CSS** – styling
- **Socket.io** – multiplayer sync (in progress)
- **Supabase / Local DB** – backend memory + agent storage (planned)
- **Vercel Serverless Functions** – distributed AI endpoints

---

## 🚀 Usage

```bash
git clone https://github.com/yourusername/webtrix
cd webtrix
npm install
npm run dev
