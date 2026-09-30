// Game Architecture Type Definitions
// Separate game logic from UI components

export type GamePhase = 'hangar' | 'launch' | 'cruise' | 'arrival' | 'results';

export interface LaunchShipSpecs {
  spacecraftMassKg: number;
  launcherId: string;
  launcherName: string;
  maxPayloadKg: number;
  thrustKn: number;
  boosterBurnTimeSec: number;
  upperStageBurnTimeSec: number;
  upperStageThrustKn: number;
  fairingMassKg: number;
  heatResistance: number; // 0.8 to 1.3
}

export interface LaunchControls {
  throttle: number; // 0 to 1
  tiltLeft: boolean;
  tiltRight: boolean;
  triggerStaging: boolean;
}

export interface LaunchTelemetry {
  // Flight kinematics
  altitudeKm: number;          // 0 to 130 km
  velocityMs: number;          // 0 to ~8000 m/s
  mach: number;                // velocity / speed of sound (~340 m/s)
  verticalSpeedMs: number;
  horizontalSpeedMs: number;
  
  // Attitude & Trajectory
  pitchDeg: number;            // 0 deg = vertical, 90 deg = horizontal
  targetPitchDeg: number;      // optimal gravity turn arc
  pitchErrorDeg: number;       // deviation from target arc
  inArcCorridor: boolean;      // true if within +/- 8 deg of target

  // Propulsion & Fuel
  throttle: number;            // 0 to 1
  currentThrustKn: number;
  twr: number;                 // current thrust-to-weight ratio
  stage: 1 | 2;                // 1 = Booster, 2 = Upper Stage
  boosterFuelPercent: number;  // 100 to 0%
  upperStageFuelPercent: number;// 100 to 0%
  stagingReady: boolean;       // true when booster burnt out and ready to stage
  staged: boolean;             // true once stage 2 is running
  fairingJettisoned: boolean;  // true after ~65 km

  // Aerodynamics & Environment
  airDensity: number;          // kg/m^3 (exponential decay)
  dynamicPressureKpa: number;  // Q = 0.5 * rho * v^2 in kPa
  inMaxQZone: boolean;         // true between ~10 - 20 km
  maxQPassed: boolean;         // true after clearing ~22 km
  maxQThrottleDownScore: number;// bonus score for reducing throttle during Max-Q

  // Structural & Thermal Health
  structuralIntegrity: number; // 100 to 0%
  thermalHeat: number;         // 0 to 100%
  shakeIntensity: number;      // 0 to 1 (for camera shake)
  overheating: boolean;
  payloadSecured: boolean;     // false if severe structural failure shakes payload loose

  // Flight Phase & Status
  flightTimeSec: number;
  orbitAchieved: boolean;
  failed: boolean;
  failureReason?: string;
  failureScientificExplanation?: string;
  commanderCallout: string;    // Real-time tactical dialogue from Commander Nova

  // Scoring
  arcAccuracyScore: number;    // 0 to 100
  maxQHandlingScore: number;   // 0 to 100
  stagingTimingScore: number;  // 0 to 100
  fuelRemainingPercent: number;// final fuel left
  totalLaunchScore: number;    // weighted total
}

export interface LaunchEvaluation {
  success: boolean;
  score: number; // 0 - 100
  orbitalVelocityAchieved: number; // m/s
  fuelRemaining: number; // %
  maxQRating: 'EXCELLENT' | 'GOOD' | 'ROUGH' | 'CRITICAL DAMAGE';
  arcRating: 'PINPOINT ARC' | 'NOMINAL' | 'DEVIATED';
  novaFeedback: string;
}
