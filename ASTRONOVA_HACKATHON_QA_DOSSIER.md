# ASTRONOVA — NASA Space Apps Challenge 2026
## Official Hackathon Team Dossier & Comprehensive Q&A Reference Guide

**Team Name:** AstroNova  
**Project Title:** MISSIONFORGE (Space Mission Design Game)  
**Challenge Category:** Space Mission Design Game  
**Format:** Official Hackathon Evaluation Q&A & Video Production Dossier  

---

### Question 1: What is the current development status of AstroNova? How much of the game have we completed so far, and what features are already working?
**Answer:**
AstroNova’s project is currently at a **fully functional, production-ready MVP+ stage (approximately 85–90% complete for the hackathon scope)**. The complete core gameplay loop is 100% playable end-to-end directly in the browser:
- **Fully Working Systems:**
  1. Complete 10-screen mission pipeline: Mission Brief formulation, 3D Solar System exploration, Procedural 3D Spacecraft Hangar, 8-instrument Scientific Payload suite, Launch Vehicle tiering, Subsystem engineering (Power, Comms, Thermal, Propulsion), Trajectory selection, Automated 6-point Flight Readiness Review (FRR), Cinematic In-Flight Simulation with dynamic anomaly events, and Official NASA Flight Evaluation Report.
  2. Four interactive action minigames:
     - **Launch Ascent Minigame:** Atmospheric gravity turn, Max-Q throttling, staging, and fairing jettison.
     - **3D Cockpit Telemetry View:** First-person pilot/avionics console.
     - **Planet Lander Minigame:** 2D/3D physics-based lunar/Martian descent thruster touchdown.
     - **Low-Poly Planet Odyssey:** Surface to interplanetary orbit spaceflight visualizer.
  3. One-click instant **Demo Mission** mode for judges and cadets.
  4. Audio synthesizer system with sound FX (`soundEffects.ts`) and theme switcher (Dark Aerospace HUD vs. Light Cadet theme).

---

### Question 2: Where can someone play AstroNova? Is it browser-based, a desktop application, or a mobile application? Is it available online or does it need to run locally?
**Answer:**
- **Platform:** AstroNova is a **100% web-based Single Page Application (SPA)**.
- **Accessibility:** It requires **zero installation, zero plugins, and zero external downloads**. It runs directly inside any modern web browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge) across desktops, laptops, and tablets.
- **Availability:** Currently, it runs locally via Vite (`npm run dev` at `http://localhost:5173/`). Because the application is built as a self-contained static client-side bundle (`dist/`), it can be hosted instantly online with zero backend dependencies on platforms such as GitHub Pages, Vercel, Netlify, or AWS S3.

---

### Question 3: What does the player see when they first open AstroNova? What does the opening screen look like, and how does the player start a mission?
**Answer:**
Upon opening AstroNova, players are greeted by an immersive, animated aerospace control center:
1. **Visual Atmosphere:** A live interactive 3D WebGL Earth floating against a deep-space starfield with real-time orbital lighting.
2. **Top Aerospace HUD Bar:** Displays the **AstroNova** / MissionForge identity, the 2026 NASA Space Apps Challenge badge, audio toggles, and light/dark theme controls.
3. **Starting a Mission:** The player has multiple immediate entry points:
   - **"START MISSION" Button:** Enters the full mission briefing and celestial destination selection matrix.
   - **"PROJECT NEW EDEN (EXODUS)" Banner:** A special narrative-driven expedition launching from Mars to an exoplanet.
   - **"DEMO MISSION" Button:** Designed specifically for judges or quick demonstrations; pre-populates a valid Lunar Polar Explorer spacecraft in under 2 seconds.
   - **Educational Portals:** "Cadet Spaceflight Handbook", "NASA Challenge Links", "Why & How We Built This", and "Cadet FAQ".

---

### Question 4: Which features of the game are already implemented, which are partially working, and which are still planned?
**Answer:**
- **Fully Implemented & Working:**
  - *Mission Selection:* 5 distinct profiles (Lunar Polar Ice, Mars Jezero Surface, Asteroid Bennu/Psyche Survey, Earth Climate Monitoring, and Project New Eden).
  - *Destination Selection:* Live environmental telemetry (distance, gravity, radiation, speed-of-light comms delay).
  - *Spacecraft Configuration:* Procedural 3D hangar where chassis decks, radiation vaults, and solar wings physically change based on player choices.
  - *Resource Management:* Real-time live balancing of mass margins, power generation vs. consumption, budget caps, and delta-v.
  - *Flight Readiness Review (FRR):* Automated 6-point pre-flight audit that red-flags violations and blocks launch if mass, power, or delta-v fail.
  - *Mission Operations & Unexpected Events:* Live flight simulation with orbital velocity, altitude, stage events, and critical in-flight anomaly popups.
  - *Final Mission Debrief:* Deterministic scoring across 5 rubrics (Science, Reliability, Budget, Comms, Trajectory) with printable/PDF export.
- **Partially Working / In Polish:**
  - *Low-Poly Surface Exploration:* Functional 3D rover traverse currently being optimized for low-spec mobile GPUs.
  - *Audio Synthesizer:* Functional Web Audio oscillators; adding voice-acted NASA Air Traffic Control callouts.
- **Planned Future Enhancements:**
  - *Multiplayer Mission Control:* Collaborative roles (Flight Director, CapCom, Systems Engineer) playing synchronously.
  - *Live NASA API Integration:* Pulling real-time space weather data from NASA DONKI/NOAA.

---

### Question 5: What NASA data or scientific references are we using in AstroNova? Are we using specific NASA datasets, information from actual NASA missions, or NASA educational resources?
**Answer:**
AstroNova integrates real-world NASA missions, datasets, and aerospace engineering standards:
1. **Actual NASA Mission Profiles & Targets:**
   - *Artemis Program:* Lunar South Pole Shackleton & Cabeus craters, targeting permanently shadowed water ice volatiles.
   - *Mars 2020 (Perseverance & Curiosity):* Jezero Crater delta sedimentation, biosignature hunting, and authentic atmospheric descent parameters.
   - *OSIRIS-REx & Psyche:* Carbonaceous and metallic asteroid topologies, microgravity proximity operations, and planetary defense data.
   - *Earth Observing System (EOS):* Sun-synchronous Low-Earth Orbit carbon cycle and sea-ice monitoring.
2. **Scientific Physics Models Built into Code:**
   - *Inverse-Square Law ($1/r^2$):* Solar radiation drops drastically beyond Mars, accurately penalizing solar panels and necessitating Nuclear Stirling RTGs.
   - *Tsiolkovsky Rocket Equation & Mass Fractions:* Realistic mass penalties where every kilogram of scientific instrument requires exponential propellant.
   - *Deep Space Network (DSN) Latency:* Authentic speed-of-light radio delay calculations (e.g., 14–22 minutes round-trip for Mars).
3. **NASA Educational & Systems References:**
   - NASA Systems Engineering Handbook (NASA/SP-6105 Rev 2) lifecycle milestones (FRR, Trade Studies, Phase A–F).
   - Embedded "Cadet Spaceflight Handbook" translating NASA technical terms into accessible learning analogies.

---

### Question 6: How does AstroNova calculate the consequences of a player's decisions? For example, when a solar storm occurs, what choices can the player make, and how does the game determine what happens afterward?
**Answer:**
Consequences in AstroNova are calculated through a **deterministic systems engineering rule engine** in `MissionContext.tsx`:
- **Scenario: In-Flight Critical Power Anomaly (Solar Storm / Penumbral Eclipse):**
  - *Trigger Condition:* Occurs during interplanetary cruise if the spacecraft's power reserve margin is under 20%.
  - *Option A — Throttle Science Sensors (Safe Mode):*
    - *Action:* The flight computer shuts down high-draw synthetic aperture radar and cryo-sensors.
    - *Consequence:* Power bus recovers immediately (+300 W power margin restored), guaranteeing spacecraft survival, but sacrifices **-15 points** from the final Scientific Return score.
  - *Option B — Force 100% Battery Drain:*
    - *Action:* Keep all science instruments active by pushing secondary lithium battery banks to maximum threshold.
    - *Consequence:* Incurs a permanent **-12% Engineering Reliability penalty**, risking battery thermal runaway, avionics brownout, or total mission loss.
- **Scenario: Deep Space Communications Degradation:**
  - *Trigger Condition:* Spacecraft equipped with an omni/low-gain antenna attempts deep-space cruise beyond the Moon.
  - *Option A — Local Flash Buffering:* Waits for optimal DSN antenna windows; preserves science data with delayed downlink.
  - *Option B — Telemetry Compression:* Compresses imagery down by 50%; maintains continuous ground lock but degrades resolution (-10 Science points).
- **Final Evaluation:** These decisions directly feed into the final **NASA Flight Debriefing Report**, determining whether the mission is classified as **MISSION SUCCESS**, **PARTIAL SUCCESS**, or **MISSION FAILURE**.

---

### Question 7: What makes AstroNova different from an ordinary space exploration game? What is the most innovative or distinctive feature of our project?
**Answer:**
1. **The Core Distinction:** Most space games are either arcade flight shooters (focusing on combat) or heavy physics simulators like *Kerbal Space Program* (which require dozens of hours learning orbital mechanics). AstroNova targets the **Systems Engineering and Trade-Off Decision Making** that real NASA mission architects face daily.
2. **The Most Innovative Feature:** The **Interactive 3D Hangar Trade-Off Matrix paired with the automated Flight Readiness Review (FRR)**. 
   - Every hardware choice visually updates the 3D spacecraft model in real time while recalculating the mass fraction, electrical power budget, budget headroom, and delta-v in real time.
   - It turns abstract aerospace formulas into an intuitive, tactile puzzle where players discover why space exploration is a delicate balancing act.

---

### Question 8: Who is the main target audience for AstroNova? What age group or type of student are we designing the game for, and who else could benefit from using it?
**Answer:**
- **Primary Audience:** Students aged **11 to 22 (Middle School, High School, and Undergraduate STEM students)**.
- **Dual-Experience Modes:**
  - *Cadet Mode:* Features intuitive terminology, interactive tooltips, and simplified analogies (e.g., explaining an RTG as a "nuclear battery that works in deep space where the sun cannot reach").
  - *Aerospace Engineer Mode:* Displays genuine aerospace metrics (Watts, Delta-V in $\text{m/s}$, $I_{sp}$, and kilograms).
- **Secondary Beneficiaries:**
  - *STEM Educators and Physics Teachers:* An interactive classroom tool to demonstrate energy conservation, gravity, and systems design.
  - *Museums & Science Centers:* A self-contained, 3-to-5 minute interactive kiosk experience for visitors.
  - *Space Enthusiasts & Hackathon Teams:* A quick sandbox to test mission concepts.

---

### Question 9: Have we tested AstroNova with students, teachers, or other users? If so, what feedback did we receive, and what improvements have we made based on their experience?
**Answer:**
Yes, AstroNova underwent interactive playtesting with student peer groups, mentors, and STEM enthusiasts during the hackathon cycle:
1. **Feedback 1:** *"Configuring all 8 subsystems and instruments at once was intimidating for first-time players."*
   - *Improvement Made:* We created the **1-Click "Demo Mission" button** and quick preset buttons on the start screen. This allows novice players to jump into a pre-configured flight instantly.
2. **Feedback 2:** *"Players wanted more interactive piloting rather than just clicking configuration menus."*
   - *Improvement Made:* We developed and integrated active action minigames—including the **Launch Ascent Minigame** (piloting through Max-Q and staging) and the **Planet Lander Minigame** (manual landing thrusters).
3. **Feedback 3:** *"Younger students struggled with aerospace acronyms like FRR, MLI, RTG, and SAR."*
   - *Improvement Made:* We authored and embedded the **Cadet Spaceflight Handbook** modal with plain-English tooltips and everyday analogies.

---

### Question 10: What materials and resources do we currently have for making the four-minute video? Do we have a playable game, screen recordings, screenshots, prototype demonstrations, team materials, or NASA scientific visuals that we can include?
**Answer:**
AstroNova has a comprehensive, ready-to-produce asset suite for the 4-minute submission video:
1. **Fully Playable Application:** A live, glitch-free build running at 60 FPS in Google Chrome, ready for high-definition screen captures.
2. **Visual & 3D Gameplay Recordings:**
   - 3D Solar System destination selector with orbital paths.
   - Procedural 3D Spacecraft Hangar showing dynamic assembly of solar wings, instruments, and thrusters.
   - Launch Ascent minigame with rocket flame particles, stage separation, and fairing deployment.
   - 3D Cockpit view and the Planet Lander touchdown simulation.
3. **Structured Timed Presentation Script:** A word-for-word 4-minute script specifically divided into 5 clear phases (Hook, Tech Architecture, Space Science, Interactive Minigames, and Debriefing).
4. **Branding & Educational Assets:**
   - Team AstroNova branding, logo emblems, NASA Space Apps Challenge badges, and official rubrics.
   - Official printable NASA Flight Evaluation Report PDF export demonstration.
   - Real NASA imagery and planetary reference maps (Moon, Mars Jezero, Asteroids, Earth LEO).
