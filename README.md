# 🚀 MISSIONFORGE — Space Mission Design Game

> **Team:** AstroNova &nbsp;|&nbsp; **Challenge:** NASA Space Apps 2026 — *"Space Mission Design Game"*

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black?logo=three.js&logoColor=white)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

---

## 👋 Read This First (For the Whole Team)

This document explains **everything** about the project in plain English — what it is, why we built it, how it works under the hood, what each tool does, and how to get it running on your machine. No background in aerospace or web development required to understand this.

---

## 🤔 What Problem Does This Solve?

**The problem:** Space exploration is one of the most complex fields of engineering, but most people (including students) have no idea what actually goes into designing a spacecraft. They think it's just "point rocket at space and go." In reality, NASA engineers spend years making thousands of trade-off decisions — budget vs. science, fuel vs. weight, solar power vs. nuclear power, fast transit vs. fuel efficiency.

**Our solution:** MISSIONFORGE is a browser game that puts YOU in the role of a NASA Mission Director. You design a real spacecraft, pick instruments, choose a rocket, set a trajectory, pass a Flight Readiness Review, and then watch your mission launch and fly — with live anomalies you have to respond to in real time.

**Why it matters:** It teaches real aerospace engineering concepts through play, not textbooks. A student who plays MISSIONFORGE for 5 minutes understands more about spacecraft systems engineering than they would from reading a 50-page manual. That's the goal.

---

## 🎮 What Is the Game, Exactly?

MISSIONFORGE is a **10-step interactive space mission simulation** that runs entirely in a web browser. Here's the full journey a player takes:

| Step | Screen | What the Player Does |
|------|--------|----------------------|
| 1 | **Mission Brief** | Pick a mission type (Moon, Mars, Asteroid, Earth orbit) |
| 2 | **Destination** | Explore a live 3D solar system, see real environmental data for each destination |
| 3 | **Spacecraft** | Choose a spacecraft chassis (small, medium, or heavy) |
| 4 | **Payload** | Mount up to 8 scientific instruments (cameras, radars, sensors) |
| 5 | **Launch Vehicle** | Pick a rocket that can actually lift your spacecraft |
| 6 | **Subsystems** | Configure power, communications, propulsion, and thermal control |
| 7 | **Trajectory** | Choose how to get there (fast & expensive, balanced, or fuel-efficient) |
| 8 | **Flight Readiness Review** | An automated checklist audits your design — if anything fails, you can't launch |
| 9 | **Launch Simulation** | Watch your rocket launch, live telemetry, and handle in-flight emergencies |
| 10 | **Mission Results** | Get a scored NASA-style flight evaluation report you can print or export as PDF |

**Demo Mode:** Hit the "DEMO MISSION" button on the start screen and the game pre-loads a working Lunar mission. You're playing in 5 seconds, no setup required. Great for demos and judges.

---

## 💡 What Makes It Educational?

The game teaches these real aerospace concepts through gameplay decisions:

- **Mass budgeting** — add too many instruments and your rocket can't lift off
- **Power budgeting** — far from the Sun, solar panels don't work; you need nuclear RTGs
- **Delta-V** — how much "speed change" your engines can produce, and why it limits where you can go
- **Communications latency** — at Mars, a radio signal takes 14–22 minutes each way; your spacecraft has to be autonomous
- **Hohmann transfers** — the most fuel-efficient path between two planets
- **Flight Readiness Review (FRR)** — the real NASA pre-launch process where every system is audited

Every decision you make has consequences. More science instruments = heavier spacecraft = needs bigger rocket = costs more money = might bust your budget. Every trade-off is real.

---

## 🛠️ Tech Stack — What We Used and Why

Here's every tool in the project, explained in plain English:

### Core
| Tool | What It Is | Why We Used It |
|------|-----------|----------------|
| **React 18** | A JavaScript library for building UIs out of reusable components | Lets us split the game into clean, independent screens (one component per game phase). Easy to maintain and add new features. |
| **TypeScript** | JavaScript with strict data types added | Catches bugs before they happen. When you have complex engineering math (mass, delta-v, power), a typo in a variable name is caught immediately instead of crashing at runtime. |
| **Vite** | A build tool that bundles the project for the browser | Starts the dev server in under 1 second. When you save a file, your browser updates instantly (called Hot Module Replacement). Way faster than older tools like Webpack. |

### 3D Graphics
| Tool | What It Is | Why We Used It |
|------|-----------|----------------|
| **Three.js** | A library that lets you render 3D scenes in the browser using WebGL | Powers the 3D solar system, rotating spacecraft hangar, animated rocket launch, planet surfaces, and orbital trajectory paths. Works without needing any special hardware or plugins. |
| **@react-three/fiber** | A React wrapper for Three.js | Lets us write 3D scenes as React components instead of raw Three.js code. Much cleaner and easier to manage. |
| **@react-three/drei** | A collection of helpers for React Three Fiber | Gives us out-of-the-box camera controls (orbit, zoom, pan), environment lighting, text rendering in 3D, and optimized shape geometries. |
| **@react-three/postprocessing** | Visual effects for 3D scenes | Adds bloom glow on rocket thrusters and engine nozzles, depth-of-field blur, and atmospheric haze. Makes the visuals look cinematic. |

### UI & Styling
| Tool | What It Is | Why We Used It |
|------|-----------|----------------|
| **Tailwind CSS** | A utility-first CSS framework | Instead of writing separate CSS files, we write style classes directly in the HTML (e.g., `bg-black/50 rounded-2xl p-4`). Keeps styles co-located with components and makes the aerospace HUD design consistent. |
| **Framer Motion** | An animation library for React | Handles all the smooth fade-ins, slide-ups, scale transitions, and screen change animations. One line of code gives you a professional animation. |
| **Canvas Confetti** | A small library for particle celebrations | Used on the Mission Success screen — fires a confetti burst when you complete a mission. |
| **Lucide React** | A library of clean, scalable icons | Provides all the aerospace/telemetry icons (satellite dish, rocket, activity monitor, etc.) as React components that scale perfectly at any size. |

### State Management
| Tool | What It Is | Why We Used It |
|------|-----------|----------------|
| **React Context API** | Built-in React tool for sharing data across components | We use it to store the entire mission state (what spacecraft you picked, what instruments, what rocket, etc.) and share it between all 10 game screens without passing props through every level. |

---

## 📁 Folder Structure

Here's how the code is organized, so you know where to look for things:

```
Game1/
├── src/
│   ├── App.tsx                  ← Root of the app. Routes between game screens.
│   ├── main.tsx                 ← Entry point. Mounts React to the HTML page.
│   ├── index.css                ← Global styles, custom CSS animations, HUD effects
│   │
│   ├── components/
│   │   ├── screens/             ← One file per game screen (Screen01 through Screen10)
│   │   │   ├── StartScreen.tsx  ← The opening animated screen with Earth
│   │   │   ├── Screen01Brief.tsx       ← Mission profile selection
│   │   │   ├── Screen02Destination.tsx ← 3D Solar System explorer
│   │   │   ├── HangarBuilder.tsx       ← 3D spacecraft configurator
│   │   │   ├── Screen04Payload.tsx     ← Scientific instruments picker
│   │   │   ├── Screen05LaunchVehicle.tsx ← Rocket selector
│   │   │   ├── Screen06Systems.tsx     ← Power, comms, propulsion, thermal
│   │   │   ├── Screen07Trajectory.tsx  ← Transfer orbit picker
│   │   │   ├── Screen08Review.tsx      ← Flight Readiness Review checklist
│   │   │   ├── Screen09Simulation.tsx  ← Live launch & flight simulation
│   │   │   └── Screen10Results.tsx     ← Mission debrief & score report
│   │   │
│   │   ├── 3d/                  ← All Three.js / React Three Fiber 3D scenes
│   │   │   ├── SolarSystemScene.tsx    ← Interactive solar system
│   │   │   ├── SpacecraftViewer.tsx    ← 3D spacecraft hangar builder
│   │   │   ├── LaunchSimulationScene.tsx ← Cinematic rocket launch
│   │   │   ├── LowPolyPlanetScene.tsx  ← Planet surface exploration
│   │   │   ├── TrajectoryScene.tsx     ← Animated orbital path
│   │   │   └── ...
│   │   │
│   │   ├── common/              ← Reusable UI pieces (error boundary, AI bot, etc.)
│   │   ├── game/                ← Minigame components (lander physics, cockpit)
│   │   └── layout/              ← GlobalNavbar (top bar shown on every screen)
│   │
│   ├── context/
│   │   ├── MissionContext.tsx   ← ⭐ The brain of the app. Stores ALL mission data.
│   │   └── ThemeContext.tsx     ← Dark / Light theme switcher
│   │
│   ├── data/
│   │   └── missionsData.ts      ← All game data: rockets, instruments, destinations, etc.
│   │
│   ├── types/
│   │   └── mission.ts           ← TypeScript type definitions for all game objects
│   │
│   └── utils/                   ← Helper functions (scoring engine, sound effects, etc.)
│
├── index.html                   ← The single HTML file the browser loads
├── package.json                 ← Project dependencies and scripts
├── vite.config.ts               ← Vite configuration
├── tailwind.config.js           ← Tailwind CSS configuration
└── tsconfig.json                ← TypeScript configuration
```

---

## 🖥️ How to Run It Locally (Step by Step)

### What You Need First

1. **Node.js** (version 18 or higher) — [Download here](https://nodejs.org)
2. **npm** (comes with Node.js automatically)

To check if you have them, open a terminal and run:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
```

### Running the Project

```bash
# Step 1: Clone the repo (or navigate to the project folder)
git clone https://github.com/your-username/missionforge.git
cd missionforge

# Step 2: Install all dependencies (only need to do this once)
npm install

# Step 3: Start the development server
npm run dev
```

Then open your browser and go to: **http://localhost:5173**

That's it. The game loads immediately. Hit **DEMO MISSION** on the start screen to jump straight into a pre-configured mission.

### Stopping the Server

Press `Ctrl + C` in the terminal.

### If Something Goes Wrong

```bash
# Delete node_modules and reinstall (fixes most dependency issues)
rm -rf node_modules
npm install
npm run dev
```

---

## 📦 Building for Production (Deploying)

When you're ready to share the game publicly:

```bash
# Build the optimized production bundle
npm run build

# Preview the production build locally before deploying
npm run preview
```

This creates a `dist/` folder containing the entire game as static HTML/CSS/JS files. You can host this folder on:
- **GitHub Pages** — free, easy, works great
- **Vercel** — connect your repo, auto-deploys on every push
- **Netlify** — same as Vercel, drag-and-drop the `dist/` folder also works

**No server or database needed.** The entire game runs in the browser.

---

## 🗺️ How the App Flows (For Developers)

```
index.html
  └── main.tsx              (mounts React)
       └── App.tsx           (wraps everything in MissionProvider + ThemeProvider)
            └── MainLayout   (reads state.currentStep, renders the right screen)
                 ├── GlobalNavbar  (always visible at top)
                 ├── [current screen component]  (changes based on step)
                 └── AISideBot     (floating AI assistant, visible after start)
```

All game data lives in **MissionContext** (`src/context/MissionContext.tsx`). Every screen reads from and writes to this single shared state. When you select a spacecraft bus in Screen 3, that selection is immediately available in Screen 8's Flight Readiness Review. Nothing is stored in a database — it all lives in React state in memory.

---

## 🌍 Mission Profiles

| Mission | Destination | What Makes It Hard |
|---------|-------------|-------------------|
| 🌙 Lunar Polar Exploration | Moon — South Pole | Polar orbit constraints, water-ice scouting for Artemis program |
| 🔴 Mars Surface Science | Jezero Crater | 22-minute communication delay, thin atmosphere for landing |
| ☄️ Asteroid Survey | Psyche / Bennu | Microgravity, non-spherical gravity, proximity operations |
| 🌍 Earth Climate Orbit | Sun-synchronous LEO | Global coverage, carbon cycle monitoring, polar ice tracking |

---

## 🔬 Real NASA Science Inside the Game

These aren't made up — these are actual physics models we coded:

- **Inverse-Square Law** → Solar panel power output is calculated as `P = P₀ / d²` where `d` is distance from the Sun. At Jupiter, solar panels produce ~25× less power than at Earth. The game forces you to use nuclear RTGs beyond the asteroid belt.
- **Tsiolkovsky Rocket Equation** → Mass budgeting is real. Every kilogram of instrument requires exponential propellant.
- **Speed-of-Light Latency** → Communication delay is `distance / c`. Mars round-trip = 14–44 minutes depending on orbital position.
- **Hohmann Transfers** → The "Balanced" trajectory option uses a Hohmann transfer calculation for delta-v cost.
- **NASA Systems Engineering FRR** → The Flight Readiness Review is modelled on NASA's actual pre-launch checklist process (NASA/SP-6105 Systems Engineering Handbook).

---

## 🤝 Contributing / Working on the Project

- **Adding a new destination?** → Edit `src/data/missionsData.ts` and add an entry to `DESTINATIONS`.
- **Changing an instrument's stats?** → Same file, `PAYLOAD_INSTRUMENTS` array.
- **Editing a game screen?** → Find the corresponding file in `src/components/screens/`.
- **Changing 3D visuals?** → All 3D scene components are in `src/components/3d/`.
- **Touching scoring logic?** → Look at `completeMission()` in `MissionContext.tsx`.

---

## ❓ Common Questions

**Q: Does it work on mobile?**  
A: Currently desktop/tablet only. There's a `MobileBlocker` component that shows a message on small screens. Responsive mobile support is planned.

**Q: Does it need internet to run?**  
A: No. Once `npm install` has run, everything works 100% offline. No external APIs are called.

**Q: Where does the game data get saved?**  
A: It doesn't persist. Mission state lives in React memory — refreshing the page resets everything. (Intended for demo purposes.)

**Q: Can we add multiplayer?**  
A: Not yet, but it's on the roadmap. The current architecture is single-player, client-side only.

**Q: What browsers work best?**  
A: Google Chrome gives the best WebGL performance for the 3D scenes. Firefox and Edge also work well. Safari works but 3D performance can vary.

---

<div align="center">

**Built for the 2026 NASA Space Apps Challenge**  
*Team AstroNova — Design. Decide. Launch.*

</div>
