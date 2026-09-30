import { 
  MissionBrief, 
  Destination, 
  SpacecraftBus, 
  PayloadInstrument, 
  LaunchVehicle, 
  PowerSystem, 
  CommsSystem, 
  PropulsionSystem, 
  ThermalSystem, 
  TrajectoryOption 
} from '../types/mission';

export const MISSION_BRIEFS: MissionBrief[] = [
  {
    id: 'exodus-new-eden',
    title: 'EXODUS: PROJECT NEW EDEN',
    targetDestinationId: 'new-eden',
    objective: 'Launch the Exodus Scout Cruiser from the Martian surface, navigate through the asteroid belt and cosmic radiation, and touch down on the habitable surface of New Eden.',
    budget: 3500, // $3.50B
    massLimit: 18000, // 18,000 kg
    durationMonths: 24,
    scientificPriority: 'Habitability survey, atmospheric sampling, seed vault deployment, safe lander touchdown',
    difficulty: 'COMPLEX',
    description: 'Earth is gone, and the Martian Ares colony domes are failing. Build a starship capable of launching from Mars, surviving deep space hazards, and landing the first colonists safely on New Eden!',
    requiredCapabilities: ['Interstellar Navigation', 'Heavy Radiation Hardening', 'Precision Aerobraking & Touchdown']
  },
  {
    id: 'lunar-polar',
    title: 'LUNAR POLAR EXPLORATION',
    targetDestinationId: 'moon',
    objective: 'Search for and characterize possible water ice deposits near permanently shadowed lunar south pole craters.',
    budget: 1200, // $1.20B
    massLimit: 8000, // 8,000 kg
    durationMonths: 18,
    scientificPriority: 'Water detection, volatile spectrometry, and high-resolution crater mapping',
    difficulty: 'STANDARD',
    description: 'The lunar south pole harbors deep craters like Shackleton and Cabeus shielded from sunlight for billions of years. Mapping volatile ice is critical for the Artemis program and future sustained deep-space exploration.',
    requiredCapabilities: ['Subsurface Detection', 'Solar/Thermal Endurance', 'High-Bandwidth Lunar Relay']
  },
  {
    id: 'mars-surface',
    title: 'MARS SURFACE SCIENCE',
    targetDestinationId: 'mars',
    objective: 'Investigate ancient aqueous lacustrine deposits and scout biosignatures in Martian Jezero delta sediment layers.',
    budget: 2400, // $2.40B
    massLimit: 14000, // 14,000 kg
    durationMonths: 36,
    scientificPriority: 'Paleo-environment characterization, organic spectrometry, and atmospheric dynamics',
    difficulty: 'COMPLEX',
    description: 'Mars presents punishing entry, descent, and landing challenges combined with deep communication lags of up to 22 minutes. Spacecraft must withstand high interplanetary radiation and abrasive dust.',
    requiredCapabilities: ['Autonomous EDL', 'High Radiation Hardening', 'Deep Space Communications']
  },
  {
    id: 'asteroid-survey',
    title: 'ASTEROID SURVEY & SAMPLE',
    targetDestinationId: 'asteroid',
    objective: 'Rendezvous with carbonaceous asteroid Bennu/Psyche, survey surface topology, and quantify precious metallic composition.',
    budget: 950, // $950M
    massLimit: 5500, // 5,500 kg
    durationMonths: 48,
    scientificPriority: 'Planetary defense trajectory analysis and core primordial composition',
    difficulty: 'MODERATE',
    description: 'Surveying a near-Earth metallic asteroid requires precision navigation in microgravity. Trajectory design must account for solar radiation pressure and non-spherical gravitational harmonics.',
    requiredCapabilities: ['Low-Thrust Ion Cruise', 'Autonomous Proximity Ops', 'High Spectral Imaging']
  },
  {
    id: 'earth-observation',
    title: 'EARTH CLIMATE OBSERVATION',
    targetDestinationId: 'earth-orbit',
    objective: 'Deploy a multi-spectral Earth observing platform into Sun-synchronous orbit to measure global atmospheric carbon flux.',
    budget: 650, // $650M
    massLimit: 4000, // 4,000 kg
    durationMonths: 60,
    scientificPriority: 'Greenhouse gas tracking, ocean chlorophyll indices, and polar ice extent',
    difficulty: 'STANDARD',
    description: 'Continuous high-fidelity monitoring of terrestrial climate dynamics from low-Earth orbit. Demands rapid continuous ground-station downlink and high imaging duty cycles.',
    requiredCapabilities: ['Ultra-High Data Downlink', 'Rapid Ground Pass Telemetry', 'Precision Pointing & Jitter Control']
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'new-eden',
    name: 'New Eden (Proxima b)',
    type: 'EXOPLANET',
    distance: '4.24 Light-Years (Warp Relay Corridor)',
    distanceKm: 40000000000000,
    travelTime: '18 - 24 months (Sub-Light Cruise)',
    travelDays: 600,
    gravity: '9.81 m/s² (1.0 g)',
    radiation: 'MODERATE',
    commDelay: 'Instant Quantum Relay / 4.2 yr Laser',
    commDelaySeconds: 4,
    environment: 'Habitable nitrogen-oxygen atmosphere, liquid oceans, magnetic field protection, lush green photosynthetic valleys.',
    difficulty: 'CHALLENGING',
    description: 'Humanity\'s Promised Haven. Following Earth\'s collapse and the decay of the Mars Ares colony domes, this newly discovered exoplanet represents the final frontier for human survival.',
    color: '#10b981',
    orbitRadius: 72
  },
  {
    id: 'moon',
    name: 'The Moon',
    type: 'MOON',
    distance: '384,400 km',
    distanceKm: 384400,
    travelTime: '3 - 5 days',
    travelDays: 4,
    gravity: '1.62 m/s² (0.166 g)',
    radiation: 'MODERATE',
    commDelay: '1.3 seconds',
    commDelaySeconds: 1.3,
    environment: 'Ultra-high vacuum, extreme thermal swings (-180°C to +120°C), abrasive electrostatically charged regolith dust.',
    difficulty: 'MODERATE',
    description: 'Earth’s celestial neighbor. Low communications latency allows near real-time mission telemetry, but shadowed craters demand robust auxiliary power.',
    color: '#94a3b8',
    orbitRadius: 18
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'PLANET',
    distance: '225,000,000 km (avg)',
    distanceKm: 225000000,
    travelTime: '6 - 9 months',
    travelDays: 210,
    gravity: '3.72 m/s² (0.38 g)',
    radiation: 'HIGH',
    commDelay: '4 to 22 minutes (avg 14m)',
    commDelaySeconds: 840,
    environment: 'Thin CO2 atmosphere (0.6% Earth sea-level), seasonal dust storms, oxidative perchlorates, cosmic ray exposure.',
    difficulty: 'HARD',
    description: 'The Red Planet. Communication lag demands high spacecraft autonomy. Interplanetary cruise requires significant delta-v and radiation mitigation.',
    color: '#ef4444',
    orbitRadius: 32
  },
  {
    id: 'asteroid',
    name: 'Asteroid (Psyche/Bennu)',
    type: 'ASTEROID',
    distance: '350,000,000 km',
    distanceKm: 350000000,
    travelTime: '2.5 - 3.5 years',
    travelDays: 1050,
    gravity: '0.002 m/s² (microgravity)',
    radiation: 'HIGH',
    commDelay: '18 to 28 minutes',
    commDelaySeconds: 1380,
    environment: 'Deep vacuum, zero atmosphere, erratic tumbling rotation, high-velocity micrometeoroids.',
    difficulty: 'CHALLENGING',
    description: 'Pristine remnants of the early solar system. Weak gravitational field allows easy orbit injection but requires pinpoint optical navigation.',
    color: '#d97706',
    orbitRadius: 44
  },
  {
    id: 'earth-orbit',
    name: 'Earth Orbit (LEO/SSO)',
    type: 'ORBIT',
    distance: '700 km altitude',
    distanceKm: 700,
    travelTime: '45 minutes',
    travelDays: 0.04,
    gravity: '9.1 m/s² (93% g)',
    radiation: 'LOW',
    commDelay: '< 0.05 seconds',
    commDelaySeconds: 0.05,
    environment: 'Shielded by Earth magnetosphere, thermal cycling every 90-minute orbit, atomic oxygen drag in upper thermosphere.',
    difficulty: 'MODERATE',
    description: 'Optimal platform for continuous global observation. Highly accessible launch windows with minimal interplanetary transit risk.',
    color: '#38bdf8',
    orbitRadius: 10
  },
  {
    id: 'jupiter',
    name: 'Jupiter / Europa',
    type: 'PLANET',
    distance: '778,000,000 km',
    distanceKm: 778000000,
    travelTime: '4.5 - 6 years',
    travelDays: 1800,
    gravity: '24.79 m/s² (2.53 g)',
    radiation: 'EXTREME',
    commDelay: '42 to 52 minutes',
    commDelaySeconds: 2700,
    environment: 'Gigantic magnetosphere accelerating intense trapped relativistic electron belts; deep cryogenic temperatures below 50K.',
    difficulty: 'EXTREME',
    description: 'The king of planets. Radiation shielding and nuclear Stirling or massive deep-space solar arrays are mandatory to survive the Jovian environment.',
    color: '#fb923c',
    orbitRadius: 58
  }
];

export const SPACECRAFT_BUSES: SpacecraftBus[] = [
  {
    id: 'bus-light',
    name: 'LIGHT BUS (Mk-I Aero)',
    category: 'BUS',
    mass: 800,
    cost: 120,
    basePowerReq: 200,
    reliability: 94,
    description: 'Compact structural chassis built with carbon-fiber honeycomb panels. Low mass and affordable, but minimal structural payload margin.',
    features: ['Low launch mass footprint', 'Single-string flight avionics', 'Compact structural truss']
  },
  {
    id: 'bus-standard',
    name: 'STANDARD BUS (Titan-II)',
    category: 'BUS',
    mass: 1200,
    cost: 180,
    basePowerReq: 300,
    reliability: 97,
    description: 'The proven workhorse for lunar and planetary missions. Features dual-redundant cold-gas reaction wheels and modular bays.',
    features: ['Dual-redundant avionics', 'Proven orbital heritage', 'Integrated thermal heat spreader', 'Standardized payload rails']
  },
  {
    id: 'bus-heavy',
    name: 'HEAVY BUS (DeepForge Pro)',
    category: 'BUS',
    mass: 1800,
    cost: 280,
    basePowerReq: 450,
    reliability: 99,
    description: 'Ultra-durable titanium-aluminum isogrid bus with radiation vaults and triple-modular redundant (TMR) fault-tolerant computers.',
    features: ['Triple modular redundant avionics', 'Heavy radiation vault shielding', 'Maximum instrument attachment points', 'Extended service lifetime']
  }
];

export const PAYLOAD_INSTRUMENTS: PayloadInstrument[] = [
  {
    id: 'inst-seed-vault',
    name: 'COLONY SEED & BIOSPHERE VAULT',
    category: 'HABITATION',
    mass: 280,
    cost: 110,
    power: 160,
    scienceValue: 35,
    dataRate: 'MEDIUM',
    reliability: 98,
    description: 'Cryogenic biosphere vault containing plant flora, microbiological cultures, and human genome archives for establishing life on New Eden.',
    primaryTargetIds: ['new-eden', 'mars', 'moon']
  },
  {
    id: 'inst-camera',
    name: 'HIGH-RESOLUTION CAMERA',
    category: 'IMAGING',
    mass: 65,
    cost: 45,
    power: 120,
    scienceValue: 18,
    dataRate: 'HIGH',
    reliability: 96,
    description: 'Narrow-angle telescopic optical camera capable of resolving surface boulders down to 25 cm/pixel resolution.',
    primaryTargetIds: ['moon', 'mars', 'asteroid', 'earth-orbit']
  },
  {
    id: 'inst-spectrometer',
    name: 'IR/UV SPECTROMETER',
    category: 'COMPOSITION',
    mass: 95,
    cost: 60,
    power: 180,
    scienceValue: 20,
    dataRate: 'MEDIUM',
    reliability: 95,
    description: 'Hyperspectral mapping spectrometer to detect mineral absorption bands, hydration signatures, and atmospheric hydrocarbons.',
    primaryTargetIds: ['moon', 'mars', 'asteroid', 'jupiter']
  },
  {
    id: 'inst-radar',
    name: 'SYNTHETIC APERTURE RADAR (SAR)',
    category: 'MAPPING',
    mass: 190,
    cost: 75,
    power: 350,
    scienceValue: 21,
    dataRate: 'HIGH',
    reliability: 93,
    description: 'All-weather, day-or-night orbital radar that pierces dust clouds and creates topological surface elevation models.',
    primaryTargetIds: ['mars', 'earth-orbit', 'jupiter']
  },
  {
    id: 'inst-gpr',
    name: 'GROUND-PENETRATING RADAR',
    category: 'SUBSURFACE',
    mass: 320,
    cost: 95,
    power: 500,
    scienceValue: 26,
    dataRate: 'HIGH',
    reliability: 91,
    description: 'Low-frequency dipole antenna array capable of imaging sub-surface glacial ice deposits up to 2.5 km deep.',
    primaryTargetIds: ['moon', 'mars']
  },
  {
    id: 'inst-magnetometer',
    name: 'FLUXGATE MAGNETOMETER',
    category: 'FIELDS',
    mass: 25,
    cost: 20,
    power: 30,
    scienceValue: 12,
    dataRate: 'LOW',
    reliability: 98,
    description: 'Deployable 4-meter boom sensor measuring remnant magnetic crustal fields and interplanetary magnetic interactions.',
    primaryTargetIds: ['moon', 'asteroid', 'jupiter']
  },
  {
    id: 'inst-radiation',
    name: 'RADIATION DETECTOR (RAD)',
    category: 'PARTICLES',
    mass: 30,
    cost: 25,
    power: 40,
    scienceValue: 14,
    dataRate: 'LOW',
    reliability: 97,
    description: 'Silicon telescope detector measuring Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) to ensure human exploration safety.',
    primaryTargetIds: ['mars', 'jupiter', 'asteroid', 'moon']
  },
  {
    id: 'inst-thermal',
    name: 'THERMAL INFRARED SENSOR',
    category: 'HEAT',
    mass: 40,
    cost: 30,
    power: 60,
    scienceValue: 15,
    dataRate: 'LOW',
    reliability: 96,
    description: 'Cryocooled microbolometer array mapping night-time surface thermal inertia and identifying cold-trap cryogenic craters.',
    primaryTargetIds: ['moon', 'mars', 'asteroid']
  },
  {
    id: 'inst-atmosphere',
    name: 'ATMOSPHERIC GAS SENSOR',
    category: 'GASES',
    mass: 85,
    cost: 50,
    power: 140,
    scienceValue: 19,
    dataRate: 'MEDIUM',
    reliability: 94,
    description: 'Quadrupole mass spectrometer and tunable laser spectrometer detecting parts-per-trillion trace methane and isotopic ratios.',
    primaryTargetIds: ['mars', 'earth-orbit', 'jupiter']
  }
];

export const LAUNCH_VEHICLES: LaunchVehicle[] = [
  {
    id: 'launch-light',
    name: 'AERO-VECTIS LIGHT LIFT',
    tier: 'LIGHT',
    payloadCapacity: 2500, // 2,500 kg
    launchCost: 90, // $90M
    reliability: 94,
    thrustKn: 2400,
    heightM: 48,
    description: 'Two-stage kerosene/liquid-oxygen rocket. Affordable for Earth orbit and ultra-light planetary scout probes.'
  },
  {
    id: 'launch-medium',
    name: 'ORBITAL HYDRA MEDIUM LIFT',
    tier: 'MEDIUM',
    payloadCapacity: 6000, // 6,000 kg
    launchCost: 180, // $180M
    reliability: 96,
    thrustKn: 5800,
    heightM: 65,
    description: 'High-cadence workhorse launcher with a high-energy upper cryogenic stage. The standard selection for Lunar Polar missions.'
  },
  {
    id: 'launch-heavy',
    name: 'ARES-VALKYRIE HEAVY LIFT',
    tier: 'HEAVY',
    payloadCapacity: 12000, // 12,000 kg
    launchCost: 320, // $320M
    reliability: 98,
    thrustKn: 12500,
    heightM: 82,
    description: 'Tri-core heavy booster configuration capable of direct trans-Mars or deep asteroid insertion with massive science payloads.'
  },
  {
    id: 'launch-super',
    name: 'TITAN-COLOSSUS SUPER HEAVY',
    tier: 'SUPER HEAVY',
    payloadCapacity: 20000, // 20,000 kg
    launchCost: 500, // $500M
    reliability: 99,
    thrustKn: 26000,
    heightM: 118,
    description: 'Next-generation methane-oxygen mega rocket. Enormous payload capability eliminates all mass margins for flagship outer-planet missions.'
  }
];

export const POWER_SYSTEMS: PowerSystem[] = [
  {
    id: 'power-small',
    name: 'SMALL SOLAR ARRAY',
    type: 'SOLAR',
    generatedWatts: 1500, // 1.5 kW
    mass: 140,
    cost: 25,
    reliability: 95,
    description: 'Compact deployable solar wings. Best for lightweight Earth orbit and minimal lunar payloads.'
  },
  {
    id: 'power-medium',
    name: 'MEDIUM SOLAR ARRAY',
    type: 'SOLAR',
    generatedWatts: 3200, // 3.2 kW
    mass: 280,
    cost: 48,
    reliability: 97,
    description: 'Dual-articulated ultra-flex solar arrays with gallium arsenide triple-junction cells. Generates solid reserves.'
  },
  {
    id: 'power-large',
    name: 'LARGE SOLAR ARRAY',
    type: 'SOLAR',
    generatedWatts: 5500, // 5.5 kW
    mass: 460,
    cost: 85,
    reliability: 98,
    description: 'Massive circular solar array blankets delivering abundant energy for high-power radar and electric thrusters.'
  },
  {
    id: 'power-advanced',
    name: 'ADVANCED RTG (STIRLING NUCLEAR)',
    type: 'RTG',
    generatedWatts: 4000, // 4.0 kW continuous
    mass: 380,
    cost: 140,
    reliability: 99.5,
    description: 'Radioisotope thermoelectric generator with Stirling convertors. Immune to solar distance and polar crater shadows.'
  }
];

export const COMMS_SYSTEMS: CommsSystem[] = [
  {
    id: 'comms-low',
    name: 'LOW GAIN OMNI-PATCH',
    type: 'LOW_GAIN',
    dataRateMbps: 0.5,
    signalReliability: 82,
    mass: 20,
    cost: 15,
    reliability: 93,
    description: 'Wide-angle hemispherical antenna. Low mass and costs, but severe transmission bottleneck for high-resolution images.'
  },
  {
    id: 'comms-medium',
    name: 'MEDIUM GAIN HORN ARRAY',
    type: 'MEDIUM_GAIN',
    dataRateMbps: 4.0,
    signalReliability: 91,
    mass: 60,
    cost: 32,
    reliability: 95,
    description: 'Steerable X-band horn antenna offering balanced throughput and decent link budget for planetary survey.'
  },
  {
    id: 'comms-high',
    name: 'HIGH GAIN CASSEGRAIN DISH (2.4m)',
    type: 'HIGH_GAIN',
    dataRateMbps: 25.0,
    signalReliability: 97,
    mass: 130,
    cost: 62,
    reliability: 98,
    description: 'Large parabolic high-gain Ka-band dish with dual-axis gimbal pointing. Reliable link preventing critical science data loss.'
  },
  {
    id: 'comms-deep',
    name: 'DEEP SPACE OPTICAL LASER ARRAY',
    type: 'DEEP_SPACE',
    dataRateMbps: 120.0,
    signalReliability: 99,
    mass: 210,
    cost: 115,
    reliability: 99,
    description: 'Next-gen near-infrared laser communication payload delivering gigabit-class transmission back to Earth ground stations.'
  }
];

export const PROPULSION_SYSTEMS: PropulsionSystem[] = [
  {
    id: 'prop-chemical',
    name: 'CHEMICAL BIPROPELLANT',
    type: 'CHEMICAL',
    deltaV: 1800, // 1,800 m/s
    fuelMass: 2400,
    isp: 325,
    efficiency: 'MODERATE',
    dryMass: 300,
    cost: 45,
    reliability: 98,
    description: 'Hypergolic hydrazine and nitrogen tetroxide thrusters delivering high impulsive thrust for rapid burns and orbit insertion.'
  },
  {
    id: 'prop-electric',
    name: 'ELECTRIC ION ENGINE',
    type: 'ELECTRIC',
    deltaV: 3800, // 3,800 m/s
    fuelMass: 650, // xenon propellant
    isp: 3100,
    efficiency: 'ULTRA-HIGH',
    dryMass: 220,
    cost: 95,
    reliability: 96,
    description: 'Hall-effect xenon thruster with extreme fuel efficiency. Requires continuous electrical power but uses a fraction of propellant mass.'
  },
  {
    id: 'prop-hybrid',
    name: 'HYBRID DUAL-MODE SYSTEM',
    type: 'HYBRID',
    deltaV: 2900, // 2,900 m/s
    fuelMass: 1500,
    isp: 850,
    efficiency: 'HIGH',
    dryMass: 320,
    cost: 75,
    reliability: 97,
    description: 'Combines a chemical main engine for high-thrust orbital insertion with high-efficiency electrothermal thrusters for cruise.'
  }
];

export const THERMAL_SYSTEMS: ThermalSystem[] = [
  {
    id: 'therm-passive',
    name: 'PASSIVE MLI & COATINGS',
    type: 'PASSIVE',
    mass: 50,
    cost: 12,
    reliability: 95,
    description: 'Gold Kapton multilayer insulation blankets, beta cloth, and high-emissivity optical solar reflectors.'
  },
  {
    id: 'therm-pipes',
    name: 'HEAT PIPES & LOUVERS',
    type: 'HEAT_PIPES',
    mass: 110,
    cost: 28,
    reliability: 97,
    description: 'Ammonia-charged aluminum loop heat pipes with bi-metallic passive louver arrays for thermal regulation.'
  },
  {
    id: 'therm-active',
    name: 'ACTIVE CRYOCOOLER & RADIATORS',
    type: 'ACTIVE_CRYO',
    mass: 220,
    cost: 55,
    reliability: 99,
    description: 'Closed-cycle Stirling mechanical cryocooler and pumped fluid loop radiators for cryogenic infrared sensors.'
  }
];

export const TRAJECTORY_OPTIONS: TrajectoryOption[] = [
  {
    id: 'traj-fast',
    name: 'FAST TRANSFER',
    deltaVRequired: 3100,
    durationDays: 2.5, // depends on destination
    fuelModifier: 1.35,
    riskModifier: 'HIGH',
    description: 'High-energy direct hyperbolic insertion. Drastically minimizes transit time through cosmic radiation belts at the expense of heavy fuel mass.'
  },
  {
    id: 'traj-balanced',
    name: 'BALANCED TRANSFER',
    deltaVRequired: 2400,
    durationDays: 4,
    fuelModifier: 1.0,
    riskModifier: 'BALANCED',
    description: 'Standard Hohmann-inspired transfer orbit. Balances transit duration, delta-v expenditure, and gravitational capture margins.'
  },
  {
    id: 'traj-efficient',
    name: 'EFFICIENT TRANSFER',
    deltaVRequired: 1900,
    durationDays: 6,
    fuelModifier: 0.78,
    riskModifier: 'LOW',
    description: 'Low-energy ballistic lunar/interplanetary capture utilizing weak stability boundaries and solar gravitational perturbations.'
  }
];

export const EDUCATIONAL_GLOSSARY: Record<string, { term: string; definition: string; practicalTip: string }> = {
  'delta-v': {
    term: 'Delta-V (Δv)',
    definition: 'A measure of the impulse needed to perform orbital maneuvers. Calculated in meters per second (m/s). It defines whether the spacecraft can escape Earth gravity and enter orbit around its destination.',
    practicalTip: 'Fast trajectories require more Δv. Electric propulsion yields massive Δv for minimal propellant mass.'
  },
  'mass-margin': {
    term: 'Payload & Mass Margin',
    definition: 'The difference between the rocket’s maximum launch capacity and the spacecraft’s wet mass (chassis + payload + propellant).',
    practicalTip: 'If your mass exceeds rocket capacity, the launch vehicle will fail to reach orbital escape velocity.'
  },
  'link-budget': {
    term: 'Link Budget & Downlink',
    definition: 'The mathematical accounting of all gains and losses from the spacecraft transmitter across interplanetary space to the Deep Space Network (DSN) on Earth.',
    practicalTip: 'High-resolution cameras and radar produce gigabytes of data. Low-gain antennas will bottleneck and lose science value.'
  },
  'power-reserve': {
    term: 'Power Generation & Reserve',
    definition: 'The surplus electrical margin (in %) above the continuous operating consumption of all bus systems and active scientific instruments.',
    practicalTip: 'A minimum 20% power reserve protects against battery discharge during orbital eclipses and instrument surges.'
  },
  'reliability': {
    term: 'System Reliability (MTBF)',
    definition: 'Statistical probability that all flight components, computers, thrusters, and sensors function without catastrophic mission-ending hardware failures.',
    practicalTip: 'Budget savings with cheaper components increase the risk of in-flight malfunctions during the simulation.'
  }
};
