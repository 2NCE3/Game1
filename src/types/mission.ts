export type ScreenStep = 
  | 'start'
  | 'brief'
  | 'destination'
  | 'hangar'
  | 'spacecraft'
  | 'payload'
  | 'launch'
  | 'systems'
  | 'trajectory'
  | 'review'
  | 'simulation'
  | 'results';

export type MissionStatus = 'DRAFT' | 'READY' | 'IN FLIGHT' | 'COMPLETE' | 'FAILED';

export interface MissionBrief {
  id: string;
  title: string;
  targetDestinationId: string;
  objective: string;
  budget: number; // in Millions USD
  massLimit: number; // in kg
  durationMonths: number;
  scientificPriority: string;
  difficulty: 'STANDARD' | 'MODERATE' | 'COMPLEX' | 'EXTREME';
  description: string;
  requiredCapabilities: string[];
}

export interface Destination {
  id: string;
  name: string;
  type: 'MOON' | 'PLANET' | 'ASTEROID' | 'ORBIT' | 'EXOPLANET';
  distance: string; // e.g. "384,400 km" or "225,000,000 km"
  distanceKm: number;
  travelTime: string; // e.g. "3 days", "7 months"
  travelDays: number;
  gravity: string; // "1.62 m/s²"
  radiation: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  commDelay: string; // "1.3 sec", "14 min"
  commDelaySeconds: number;
  environment: string;
  difficulty: 'MODERATE' | 'CHALLENGING' | 'HARD' | 'EXTREME';
  description: string;
  color: string;
  orbitRadius: number;
}

export interface SpacecraftBus {
  id: string;
  name: string;
  category: 'BUS';
  mass: number; // kg
  cost: number; // $M
  basePowerReq: number; // W
  reliability: number; // percentage e.g. 96
  description: string;
  features: string[];
}

export interface PayloadInstrument {
  id: string;
  name: string;
  category: string;
  mass: number; // kg
  cost: number; // $M
  power: number; // Watts
  scienceValue: number; // points e.g. +22
  dataRate: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  reliability: number; // percentage
  description: string;
  primaryTargetIds: string[]; // destinations this is best for
}

export interface LaunchVehicle {
  id: string;
  name: string;
  payloadCapacity: number; // kg
  launchCost: number; // $M
  reliability: number; // percentage
  thrustKn: number;
  heightM: number;
  description: string;
  tier: 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'SUPER HEAVY';
}

export interface PowerSystem {
  id: string;
  name: string;
  type: 'SOLAR' | 'RTG' | 'HYBRID';
  generatedWatts: number;
  mass: number;
  cost: number;
  reliability: number;
  description: string;
}

export interface CommsSystem {
  id: string;
  name: string;
  type: 'LOW_GAIN' | 'MEDIUM_GAIN' | 'HIGH_GAIN' | 'DEEP_SPACE';
  dataRateMbps: number;
  signalReliability: number;
  mass: number;
  cost: number;
  reliability: number;
  description: string;
}

export interface PropulsionSystem {
  id: string;
  name: string;
  type: 'CHEMICAL' | 'ELECTRIC' | 'HYBRID';
  deltaV: number; // m/s delta-v delivered
  fuelMass: number; // kg
  isp: number; // seconds
  efficiency: 'MODERATE' | 'HIGH' | 'ULTRA-HIGH';
  dryMass: number;
  cost: number;
  reliability: number;
  description: string;
}

export interface ThermalSystem {
  id: string;
  name: string;
  type: 'PASSIVE' | 'HEAT_PIPES' | 'ACTIVE_CRYO';
  mass: number;
  cost: number;
  reliability: number;
  description: string;
}

export interface TrajectoryOption {
  id: string;
  name: 'FAST TRANSFER' | 'BALANCED TRANSFER' | 'EFFICIENT TRANSFER';
  deltaVRequired: number; // m/s
  durationDays: number;
  fuelModifier: number; // multiplier
  riskModifier: 'HIGH' | 'BALANCED' | 'LOW';
  description: string;
}

export interface MissionResources {
  totalMass: number;
  massLimit: number;
  isOverMass: boolean;
  totalCost: number;
  budgetLimit: number;
  isOverBudget: boolean;
  powerGenerated: number;
  powerRequired: number;
  powerReservePercent: number;
  isPowerDeficit: boolean;
  fuelPercent: number;
  deltaVAvailable: number;
  deltaVRequired: number;
  isDeltaVDeficit: boolean;
  totalScience: number;
  overallReliability: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  readinessScore: number;
}

export interface ReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: 'error' | 'warning' | 'success';
  message: string;
  details?: string;
}

export interface SimEventDecision {
  id: string;
  title: string;
  description: string;
  currentMetric: string;
  requiredMetric: string;
  consequence: string;
  options: {
    label: string;
    description: string;
    impact: {
      science?: number;
      power?: number;
      fuel?: number;
      reliability?: number;
    };
  }[];
}

export interface TelemetrySnapshot {
  altitudeKm: number;
  velocityKms: number;
  fuelPercent: number;
  powerWatts: number;
  tempCelsius: number;
  signalStrength: number;
  missionTime: string;
  stageName: string;
  distanceProgressPercent: number;
}

export interface SimulationEventLog {
  timestamp: string;
  message: string;
  type: 'nominal' | 'alert' | 'success' | 'warn' | 'decision';
}

export interface MissionResultReport {
  outcome: 'MISSION SUCCESS' | 'PARTIAL SUCCESS' | 'MISSION FAILURE';
  scientificReturnScore: number;
  engineeringReliabilityScore: number;
  resourceEfficiencyScore: number;
  communicationScore: number;
  trajectoryEfficiencyScore: number;
  overallScore: number;
  scienceDataPercent: number;
  summary: string;
  whatWentWell: string[];
  whatCouldImprove: string[];
  criticalDecisionNote: string;
}

export interface MissionState {
  // Selections
  briefId: string | null;
  destinationId: string | null;
  busId: string | null;
  payloadIds: string[];
  launchVehicleId: string | null;
  powerSystemId: string | null;
  commsSystemId: string | null;
  propulsionSystemId: string | null;
  thermalSystemId: string | null;
  trajectoryId: string | null;
  missionName: string;
  
  // Status
  currentStep: ScreenStep;
  status: MissionStatus;
  
  // Custom user decision choices during sim
  resolvedDecisions: Record<string, number>;
  
  // Cadet Mode for children and easy guidance
  cadetMode: boolean;

  // Demo Mode flag: preloads all 8 subsystems only when demo mode is active
  isDemoMode?: boolean;
  
  // Final evaluation cache
  lastResult: MissionResultReport | null;
}
