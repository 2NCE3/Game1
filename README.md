# MISSIONFORGE — Space Mission Design Game

> *"Design. Decide. Launch."*

**MISSIONFORGE** is a web-based, interactive space mission engineering and flight simulation game prototype designed for the **2026 NASA Space Apps Challenge** (*"Space Mission Design Game"*).

The game places players in the role of a NASA Mission Director and Chief Spacecraft Systems Engineer. Players design an interplanetary mission, configure spacecraft hardware, balance real aerospace trade-offs (budget, mass, power, communication latency, and delta-v), evaluate flight readiness, and simulate the launch and deep-space transit while responding to live flight anomalies.

---

## 🚀 Key Features & Gameplay Loop

1. **Phase 01 — Mission Brief:**
   - Select from 4 mission profiles:
     - **Lunar Polar Exploration** (Artemis volatile water-ice scouting)
     - **Mars Surface Science** (Jezero delta astrobiology & sediment sampling)
     - **Asteroid Survey & Sample** (Psyche/Bennu composition & planetary defense)
     - **Earth Climate Observation** (Sun-synchronous carbon cycle monitoring)
   - Strict Congressional budget authorizations and launcher mass limits.

2. **Phase 02 — Interactive 3D Solar System Destination:**
   - Real-time 3D solar system with orbital paths and interactive celestial targets.
   - Comprehensive environmental telemetry: transit duration, surface gravity, cosmic radiation levels, vacuum thermal extremes, and communications latency.

3. **Phase 03 — Procedural 3D Spacecraft Designer:**
   - Modular bus selection: **Light Bus (Mk-I Aero)**, **Standard Bus (Titan-II)**, and **Heavy Bus (DeepForge Pro)**.
   - Interactive 3D model immediately adapts chassis structure, radiation vaulting, and equipment decks based on hardware selections.

4. **Phase 04 — Scientific Payload Suite:**
   - Mount and configure 8 instruments:
     - High-Resolution Optical Camera
     - Hyperspectral IR/UV Spectrometer
     - Synthetic Aperture Radar (SAR)
     - Ground-Penetrating Radar (GPR)
     - Fluxgate Magnetometer Boom
     - Galactic Cosmic Ray Radiation Detector (RAD)
     - Thermal Infrared Cryo-Sensor
     - Quadrupole Atmospheric Gas Sensor
   - Live trade-offs: More instruments = higher science points, but heavier mass and higher electrical wattage draw.

5. **Phase 05 — Launch Vehicle Architecture:**
   - 4 rocket classes: **Light Lift**, **Medium Lift**, **Heavy Lift**, and **Super Heavy**.
   - 3D rocket model preview with stage rings and aerodynamic payload fairing.
   - Real-time payload capacity checks with visual over-capacity alerts.

6. **Phase 06 — Spacecraft Subsystems:**
   - **Electrical Power:** Small, Medium, Large Ultra-Flex solar arrays vs. Advanced Stirling RTG Nuclear systems. Includes realistic inverse-square solar radiation dropoff for outer planet destinations (e.g., Jupiter).
   - **Deep Space Communications:** Low-gain omni whips, Medium-gain horns, High-gain Cassegrain parabolic dishes, and Deep-space optical laser arrays.
   - **Propulsion & Maneuvering:** Chemical bipropellant, High-efficiency Hall-effect Xenon ion engines, and Hybrid dual-mode propulsion.
   - **Thermal Control:** Multi-layer insulation (MLI), loop heat pipes with louvers, and active closed-cycle cryocoolers.

7. **Phase 07 — Astrodynamics & Orbital Trajectories:**
   - 3D curved trajectory paths between Earth and target celestial bodies.
   - Choose between **Fast Transfer** (direct hyperbolic, high fuel, low transit time), **Balanced Transfer** (Hohmann-style), and **Efficient Transfer** (weak-stability ballistic capture).
   - Animated probe traveling along the transfer trajectory with thrust vectors.

8. **Phase 08 — Flight Readiness Review (FRR):**
   - Readiness score percentage (0–100%) and 6 automated engineering checklist audits.
   - Prevents launch authorization if critical violations exist (mass deficit, power deficit, or delta-v shortfall).

9. **Phase 09 — Cinematic Launch & In-Flight Simulation:**
   - Terminal countdown (T-10s..0s), main engine ignition, atmospheric ascent, staging, fairing jettison, solar deployment, and cruise.
   - Live telemetry panel (altitude, velocity, fuel remaining, power output, temperature, DSN signal strength).
   - In-flight event alerts with player decision choices (e.g., power shedding vs. battery drain, telemetry throttling vs. flash buffering).

10. **Phase 10 — Mission Results & Official NASA Flight Report:**
    - Deterministic evaluation: **MISSION SUCCESS**, **PARTIAL SUCCESS**, or **MISSION FAILURE**.
    - 5-category scoring: Scientific Return, Engineering Reliability, Resource Efficiency, Communications, Trajectory.
    - Post-flight analysis: *"What Went Well"*, *"What Could Improve"*, and *"Critical Decision Analysis"*.
    - **Print / PDF Export:** Clean printable official NASA Flight Evaluation Report.

11. **Demo Mode:**
    - One-click **DEMO MISSION** button on the Start Screen and Top Bar immediately pre-populates a valid Lunar Polar Explorer mission playable in 3–5 minutes.

---

## 🛠️ Technology Stack

- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Custom Aerospace HUD design system
- **3D Graphics & Physics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** Framer Motion, Canvas Confetti
- **Icons:** Lucide Icons (`lucide-react`)
- **Architecture:** 100% Client-side local deterministic simulation (no backend or database required)

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Launch

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in your browser
http://localhost:5173/
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛰️ NASA Space Apps Challenge Alignment

MISSIONFORGE addresses the core goals of the **Space Mission Design Game** challenge by:
1. Translating complex systems engineering principles into an engaging, accessible, and scientifically grounded interactive simulation.
2. Demonstrating the interconnected trade-offs of space exploration (mass margins, link budgets, delta-v, and power reserves).
3. Providing educational tooltips on every aerospace concept (Delta-V, ISP, GCR radiation, aerobraking, payload fraction).
4. Offering an immediate 30-second understanding for judges and a rich 3–5 minute full mission experience.
