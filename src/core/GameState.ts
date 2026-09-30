// MISSIONFORGE Core Game State & Resource Management System

export type MissionPhase = 
  | 'BASE_VIEW' 
  | 'COUNTDOWN'
  | 'LIFTOFF' 
  | 'BREAKOUT' 
  | 'SPACE_TRANSIT' 
  | 'RETROGRADE_BURN' 
  | 'DESTINATION_APPROACH' 
  | 'ARRIVAL_SUCCESS'
  | 'CRITICAL_FAILURE';

export interface GameResources {
  deltaV: number;         // Current Delta-V / Propellant in m/s (0 to maxDeltaV)
  maxDeltaV: number;      // Maximum Delta-V based on fuel tank & engine choices
  hull: number;           // Hull integrity (0 to 100%)
  energy: number;         // Electrical energy reserve (0 to 100%)
  oxygen: number;         // Life support oxygen reserve (0 to 100%)
  science: number;        // Science data collected in points
  credits: number;        // Mission funding credits earned
}

export type FailureEventType = 
  | 'ENGINE_OVERHEAT' 
  | 'SOLAR_ARRAY_FAULT' 
  | 'COMM_BLACKOUT' 
  | 'ASTEROID_HAZARD';

export interface FailureEvent {
  id: string;
  type: FailureEventType;
  title: string;
  description: string;
  severity: 'WARNING' | 'CRITICAL';
  options: {
    label: string;
    action: () => void;
    description: string;
  }[];
}

export interface FlightSimRefData {
  phase: MissionPhase;
  flightProgress: number; // 0 to 100%
  flightSpeed: number;    // km/h
  altitude: number;       // km
  steeringAngle: number;  // -1 to 1
  isWarping: boolean;
}

export interface FlightTelemetryData {
  phase: MissionPhase;
  progress: number;       // 0 to 100%
  speed: number;          // km/h
  altitude: number;       // km
  steeringAngle: number;  // -1 to 1
  isWarping: boolean;
  isBraking: boolean;
  approachAccuracy: number; // 0 to 100% corridor alignment
  captureBurnSuccess: boolean;
}

export class GameStateManager {
  public resources: GameResources = {
    deltaV: 4200,
    maxDeltaV: 4200,
    hull: 100,
    energy: 100,
    oxygen: 100,
    science: 0,
    credits: 1000,
  };

  public telemetry: FlightTelemetryData = {
    phase: 'BASE_VIEW',
    progress: 0,
    speed: 0,
    altitude: 0,
    steeringAngle: 0,
    isWarping: false,
    isBraking: false,
    approachAccuracy: 50,
    captureBurnSuccess: false,
  };

  public activeFailure: FailureEvent | null = null;
  public asteroidCount: number = 60;
  public asteroidsAvoided: number = 0;

  // Consume Delta-V propellant dynamically
  public consumeDeltaV(amount: number): boolean {
    if (this.resources.deltaV <= 0) {
      this.resources.deltaV = 0;
      return false;
    }
    this.resources.deltaV = Math.max(0, this.resources.deltaV - amount);
    return true;
  }

  // Apply hull damage
  public applyDamage(amount: number) {
    this.resources.hull = Math.max(0, this.resources.hull - amount);
    if (this.resources.hull <= 0) {
      this.telemetry.phase = 'CRITICAL_FAILURE';
    }
  }

  // Add science
  public addScience(pts: number) {
    this.resources.science += pts;
  }

  // Reset state
  public reset(initialDeltaV = 4200) {
    this.resources = {
      deltaV: initialDeltaV,
      maxDeltaV: initialDeltaV,
      hull: 100,
      energy: 100,
      oxygen: 100,
      science: 0,
      credits: 1000,
    };
    this.telemetry = {
      phase: 'BASE_VIEW',
      progress: 0,
      speed: 0,
      altitude: 0,
      steeringAngle: 0,
      isWarping: false,
      isBraking: false,
      approachAccuracy: 50,
      captureBurnSuccess: false,
    };
    this.activeFailure = null;
    this.asteroidsAvoided = 0;
  }
}

export const gameState = new GameStateManager();
