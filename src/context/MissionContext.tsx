import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { 
  MissionState, 
  ScreenStep, 
  MissionStatus, 
  MissionResources, 
  ReadinessCheck, 
  MissionResultReport, 
  SimEventDecision,
  TelemetrySnapshot,
  SimulationEventLog
} from '../types/mission';
import { 
  MISSION_BRIEFS, 
  DESTINATIONS, 
  SPACECRAFT_BUSES, 
  PAYLOAD_INSTRUMENTS, 
  LAUNCH_VEHICLES, 
  POWER_SYSTEMS, 
  COMMS_SYSTEMS, 
  PROPULSION_SYSTEMS, 
  THERMAL_SYSTEMS, 
  TRAJECTORY_OPTIONS 
} from '../data/missionsData';

interface MissionContextType {
  state: MissionState;
  resources: MissionResources;
  readinessChecks: ReadinessCheck[];
  setStep: (step: ScreenStep) => void;
  selectBrief: (briefId: string) => void;
  selectDestination: (destinationId: string) => void;
  selectBus: (busId: string) => void;
  togglePayload: (instrumentId: string) => void;
  selectLaunchVehicle: (vehicleId: string) => void;
  selectPowerSystem: (powerId: string) => void;
  selectCommsSystem: (commsId: string) => void;
  selectPropulsionSystem: (propId: string) => void;
  selectThermalSystem: (thermalId: string) => void;
  selectTrajectory: (trajId: string) => void;
  setMissionName: (name: string) => void;
  loadDemoMission: () => void;
  resetMission: (targetStep?: ScreenStep) => void;
  completeMission: (manualScore?: number) => void;
  canNavigateToStep: (step: ScreenStep) => boolean;
  
  // Cadet / Child-friendly assistance
  cadetMode: boolean;
  toggleCadetMode: () => void;
  autoBalanceMission: () => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;

  // Simulation controls
  isSimRunning: boolean;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  activeDecision: SimEventDecision | null;
  resolveDecision: (optionIndex: number) => void;
  telemetry: TelemetrySnapshot;
  eventLogs: SimulationEventLog[];
  countdownNumber: number | null;
  startSimulation: () => void;
  launchToPad: () => void;
  abortSimulation: () => void;
}

const INITIAL_STATE: MissionState = {
  briefId: null,
  destinationId: null,
  busId: null,
  payloadIds: [],
  launchVehicleId: null,
  powerSystemId: null,
  commsSystemId: null,
  propulsionSystemId: null,
  thermalSystemId: null,
  trajectoryId: null,
  missionName: 'ARTEMIS FORGE-1',
  currentStep: 'start',
  status: 'DRAFT',
  resolvedDecisions: {},
  cadetMode: true,
  isDemoMode: false,
  lastResult: null
};

export const INITIAL_TELEMETRY: TelemetrySnapshot = {
  altitudeKm: 0,
  velocityKms: 0,
  fuelPercent: 100,
  powerWatts: 0,
  tempCelsius: 21,
  signalStrength: 100,
  missionTime: 'T-00:00:10',
  stageName: 'PRE-LAUNCH PAD OPERATIONS',
  distanceProgressPercent: 0
};

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MissionState>(INITIAL_STATE);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [activeDecision, setActiveDecision] = useState<SimEventDecision | null>(null);
  const [eventLogs, setEventLogs] = useState<SimulationEventLog[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(INITIAL_TELEMETRY);

  // Navigation guard
  const canNavigateToStep = useCallback((step: ScreenStep): boolean => {
    if (step === 'start') return true;
    if (step === 'brief') return true;
    if (step === 'destination') return !!state.briefId;
    if (step === 'hangar') return !!state.destinationId;
    if (step === 'spacecraft') return !!state.destinationId;
    if (step === 'payload') return !!state.busId;
    if (step === 'launch') return state.payloadIds.length > 0;
    if (step === 'systems') return !!state.launchVehicleId;
    if (step === 'trajectory') return !!state.powerSystemId && !!state.commsSystemId && !!state.propulsionSystemId;
    if (step === 'review') return !!state.trajectoryId;
    if (step === 'simulation') return !!state.trajectoryId;
    if (step === 'results') return !!state.lastResult;
    return false;
  }, [state]);

  const setStep = useCallback((step: ScreenStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const selectBrief = useCallback((briefId: string) => {
    const brief = MISSION_BRIEFS.find(b => b.id === briefId);
    setState(prev => ({
      ...prev,
      briefId,
      destinationId: brief ? brief.targetDestinationId : prev.destinationId,
      missionName: brief ? `${brief.title.split(' ')[0]} FORGE` : prev.missionName,
      // Fresh custom build: only preload all 8 subsystems if demo mode was explicitly loaded
      busId: null,
      payloadIds: [],
      launchVehicleId: null,
      powerSystemId: null,
      commsSystemId: null,
      propulsionSystemId: null,
      thermalSystemId: null,
      trajectoryId: null,
      isDemoMode: false,
      currentStep: 'destination'
    }));
  }, []);

  const selectDestination = useCallback((destinationId: string) => {
    setState(prev => ({
      ...prev,
      destinationId,
      currentStep: 'hangar'
    }));
  }, []);

  const selectBus = useCallback((busId: string) => {
    setState(prev => ({
      ...prev,
      busId
    }));
  }, []);

  const togglePayload = useCallback((instrumentId: string) => {
    setState(prev => {
      const exists = prev.payloadIds.includes(instrumentId);
      const nextIds = exists 
        ? prev.payloadIds.filter(id => id !== instrumentId)
        : [...prev.payloadIds, instrumentId];
      return { ...prev, payloadIds: nextIds };
    });
  }, []);

  const selectLaunchVehicle = useCallback((launchVehicleId: string) => {
    setState(prev => ({
      ...prev,
      launchVehicleId
    }));
  }, []);

  const selectPowerSystem = useCallback((powerSystemId: string) => {
    setState(prev => ({ ...prev, powerSystemId }));
  }, []);

  const selectCommsSystem = useCallback((commsSystemId: string) => {
    setState(prev => ({ ...prev, commsSystemId }));
  }, []);

  const selectPropulsionSystem = useCallback((propulsionSystemId: string) => {
    setState(prev => ({ ...prev, propulsionSystemId }));
  }, []);

  const selectThermalSystem = useCallback((thermalSystemId: string) => {
    setState(prev => ({ ...prev, thermalSystemId }));
  }, []);

  const selectTrajectory = useCallback((trajectoryId: string) => {
    setState(prev => ({
      ...prev,
      trajectoryId
    }));
  }, []);

  const setMissionName = useCallback((missionName: string) => {
    setState(prev => ({ ...prev, missionName }));
  }, []);

  // Cadet Mode toggle
  const toggleCadetMode = useCallback(() => {
    setState(prev => ({ ...prev, cadetMode: !prev.cadetMode }));
  }, []);

  // Smart Auto-Fix / Auto-Balance for children and beginners
  const autoBalanceMission = useCallback(() => {
    setState(prev => {
      const briefId = prev.briefId || 'lunar-polar';
      const brief = MISSION_BRIEFS.find(b => b.id === briefId);
      const destinationId = prev.destinationId || (brief ? brief.targetDestinationId : 'moon');
      const busId = prev.busId || 'bus-standard';
      
      let payloadIds = prev.payloadIds;
      if (payloadIds.length === 0) {
        payloadIds = ['inst-camera', 'inst-spectrometer'];
      }

      let launchVehicleId = prev.launchVehicleId || 'launch-medium';
      if (payloadIds.length >= 4) {
        launchVehicleId = 'launch-heavy';
      }

      let powerSystemId = prev.powerSystemId || 'power-medium';
      if (destinationId === 'jupiter') {
        powerSystemId = 'power-advanced';
      } else if (payloadIds.length >= 3) {
        powerSystemId = 'power-large';
      }

      const commsSystemId = prev.commsSystemId || 'comms-high';
      const propulsionSystemId = prev.propulsionSystemId || 'prop-hybrid';
      const thermalSystemId = prev.thermalSystemId || 'therm-pipes';
      const trajectoryId = prev.trajectoryId || 'traj-balanced';

      return {
        ...prev,
        briefId,
        destinationId,
        busId,
        payloadIds,
        launchVehicleId,
        powerSystemId,
        commsSystemId,
        propulsionSystemId,
        thermalSystemId,
        trajectoryId,
        status: 'READY'
      };
    });
  }, []);

  const STEPS_ORDER: ScreenStep[] = [
    'start',
    'brief',
    'destination',
    'hangar',
    'review',
    'simulation',
    'results'
  ];

  const goToNextStep = useCallback(() => {
    setState(prev => {
      const currentIndex = STEPS_ORDER.indexOf(prev.currentStep);
      // For legacy steps not in the new order, map them to the hangar
      if (currentIndex < 0) {
        return { ...prev, currentStep: 'hangar' };
      }
      if (currentIndex >= 0 && currentIndex < STEPS_ORDER.length - 1) {
        const nextStep = STEPS_ORDER[currentIndex + 1];
        
        const updated = { ...prev, currentStep: nextStep };
        if (nextStep === 'destination' && !updated.briefId) {
          updated.briefId = 'lunar-polar';
          updated.destinationId = 'moon';
        }
        if (nextStep === 'hangar' && !updated.destinationId) {
          updated.destinationId = 'moon';
        }
        if (nextStep === 'review') {
          // Ensure minimum selections when transitioning from hangar to review
          if (!updated.busId) updated.busId = 'bus-standard';
          if (updated.payloadIds.length === 0) updated.payloadIds = ['inst-camera', 'inst-spectrometer'];
          if (!updated.launchVehicleId) updated.launchVehicleId = 'launch-medium';
          if (!updated.powerSystemId) updated.powerSystemId = 'power-medium';
          if (!updated.commsSystemId) updated.commsSystemId = 'comms-high';
          if (!updated.propulsionSystemId) updated.propulsionSystemId = 'prop-hybrid';
          if (!updated.thermalSystemId) updated.thermalSystemId = 'therm-pipes';
          if (!updated.trajectoryId) updated.trajectoryId = 'traj-balanced';
        }
        return updated;
      }
      return prev;
    });
  }, []);

  const goToPrevStep = useCallback(() => {
    setState(prev => {
      const currentIndex = STEPS_ORDER.indexOf(prev.currentStep);
      if (currentIndex > 1) {
        return { ...prev, currentStep: STEPS_ORDER[currentIndex - 1] };
      }
      if (currentIndex === 1) {
        return { ...prev, currentStep: 'start' };
      }
      return prev;
    });
  }, []);

  // Demo Mission loader
  const loadDemoMission = useCallback(() => {
    setIsSimRunning(false);
    setCountdownNumber(null);
    setActiveDecision(null);
    setEventLogs([]);
    setTelemetry(INITIAL_TELEMETRY);
    setState({
      briefId: 'lunar-polar',
      destinationId: 'moon',
      busId: 'bus-standard',
      payloadIds: ['inst-camera', 'inst-spectrometer', 'inst-gpr'],
      launchVehicleId: 'launch-medium',
      powerSystemId: 'power-medium',
      commsSystemId: 'comms-high',
      propulsionSystemId: 'prop-hybrid',
      thermalSystemId: 'therm-pipes',
      trajectoryId: 'traj-balanced',
      missionName: 'LUNAR ICE HUNTER',
      currentStep: 'hangar',
      status: 'READY',
      resolvedDecisions: {},
      cadetMode: true,
      isDemoMode: true,
      lastResult: null
    });
  }, []);

  // Reset Mission
  const resetMission = useCallback((targetStep: ScreenStep = 'brief') => {
    setIsSimRunning(false);
    setCountdownNumber(null);
    setActiveDecision(null);
    setEventLogs([]);
    setTelemetry(INITIAL_TELEMETRY);
    setState({
      ...INITIAL_STATE,
      currentStep: targetStep,
      isDemoMode: false,
      lastResult: null
    });
  }, []);

  // CALCULATE MISSION RESOURCES & FEASIBILITY FORMULAS
  const resources: MissionResources = useMemo(() => {
    const brief = MISSION_BRIEFS.find(b => b.id === state.briefId);
    const destination = DESTINATIONS.find(d => d.id === state.destinationId);
    const bus = SPACECRAFT_BUSES.find(b => b.id === state.busId);
    const payloads = PAYLOAD_INSTRUMENTS.filter(p => state.payloadIds.includes(p.id));
    const rocket = LAUNCH_VEHICLES.find(r => r.id === state.launchVehicleId);
    const power = POWER_SYSTEMS.find(p => p.id === state.powerSystemId);
    const comms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId);
    const prop = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId);
    const therm = THERMAL_SYSTEMS.find(t => t.id === state.thermalSystemId);
    const traj = TRAJECTORY_OPTIONS.find(t => t.id === state.trajectoryId);

    // Mass
    const busMass = bus?.mass || 0;
    const payloadMass = payloads.reduce((acc, curr) => acc + curr.mass, 0);
    const powerMass = power?.mass || 0;
    const commsMass = comms?.mass || 0;
    const thermMass = therm?.mass || 0;
    const propDryMass = prop?.dryMass || 0;
    const fuelMultiplier = traj?.fuelModifier || 1.0;
    const propFuelMass = Math.round((prop?.fuelMass || 0) * fuelMultiplier);

    const totalMass = busMass + payloadMass + powerMass + commsMass + thermMass + propDryMass + propFuelMass;
    const massLimit = rocket ? rocket.payloadCapacity : (brief?.massLimit || 8000);
    const isOverMass = totalMass > massLimit;

    // Cost
    const busCost = bus?.cost || 0;
    const payloadCost = payloads.reduce((acc, curr) => acc + curr.cost, 0);
    const rocketCost = rocket?.launchCost || 0;
    const powerCost = power?.cost || 0;
    const commsCost = comms?.cost || 0;
    const propCost = prop?.cost || 0;
    const thermCost = therm?.cost || 0;
    const trajCostOffset = traj?.name === 'FAST TRANSFER' ? 30 : (traj?.name === 'EFFICIENT TRANSFER' ? -15 : 0);

    const totalCost = busCost + payloadCost + rocketCost + powerCost + commsCost + propCost + thermCost + trajCostOffset;
    const budgetLimit = brief?.budget || 1200;
    const isOverBudget = totalCost > budgetLimit;

    // Power
    // Note: Solar power diminishes with inverse square law if going to outer planets (e.g. Jupiter)
    let solarMultiplier = 1.0;
    if (destination?.id === 'jupiter' && power?.type === 'SOLAR') {
      solarMultiplier = 0.05; // 5% solar flux at Jupiter
    }
    const powerGenerated = Math.round((power?.generatedWatts || 0) * solarMultiplier);
    
    const busPower = bus?.basePowerReq || 0;
    const payloadPower = payloads.reduce((acc, curr) => acc + curr.power, 0);
    const propPower = prop?.type === 'ELECTRIC' ? 1200 : (prop?.type === 'HYBRID' ? 350 : 50);
    const commsPower = comms?.type === 'DEEP_SPACE' ? 400 : (comms?.type === 'HIGH_GAIN' ? 250 : 80);
    const thermPower = 60;

    const powerRequired = busPower + payloadPower + propPower + commsPower + thermPower;
    const isPowerDeficit = powerGenerated < powerRequired;
    const powerReservePercent = powerRequired > 0 
      ? Math.round(((powerGenerated - powerRequired) / powerRequired) * 100)
      : 0;

    // Delta-V / Propulsion
    let destinationDeltaVMultiplier = 1.0;
    if (destination?.id === 'mars') destinationDeltaVMultiplier = 1.45;
    else if (destination?.id === 'asteroid') destinationDeltaVMultiplier = 1.6;
    else if (destination?.id === 'earth-orbit') destinationDeltaVMultiplier = 0.45;
    else if (destination?.id === 'jupiter') destinationDeltaVMultiplier = 2.2;

    const deltaVRequired = Math.round((traj?.deltaVRequired || 2400) * destinationDeltaVMultiplier);
    const deltaVAvailable = prop?.deltaV || 0;
    const isDeltaVDeficit = deltaVAvailable < deltaVRequired;
    const fuelPercent = deltaVRequired > 0 
      ? Math.min(100, Math.round((deltaVAvailable / deltaVRequired) * 100))
      : 0;

    // Science Score
    let rawScience = 0;
    payloads.forEach(p => {
      let val = p.scienceValue;
      if (destination && p.primaryTargetIds.includes(destination.id)) {
        val = Math.round(val * 1.25); // 25% target synergy bonus
      }
      rawScience += val;
    });
    // Comms bandwidth effect on science collection
    if (comms?.dataRateMbps && comms.dataRateMbps < 2 && payloads.length >= 3) {
      rawScience = Math.round(rawScience * 0.85); // bandwidth choke
    }
    const totalScience = rawScience;

    // Reliability
    const reliabilities = [
      bus?.reliability,
      rocket?.reliability,
      power?.reliability,
      comms?.reliability,
      prop?.reliability,
      therm?.reliability,
      ...(payloads.map(p => p.reliability))
    ].filter((r): r is number => typeof r === 'number');

    const overallReliability = reliabilities.length > 0 
      ? Math.round(reliabilities.reduce((a, b) => a + b, 0) / reliabilities.length)
      : 85;

    // Risk Rating
    let riskPoints = 0;
    if (isOverMass) riskPoints += 40;
    if (isOverBudget) riskPoints += 25;
    if (isPowerDeficit) riskPoints += 35;
    else if (powerReservePercent < 15) riskPoints += 15;
    if (isDeltaVDeficit) riskPoints += 35;
    if (overallReliability < 93) riskPoints += 15;
    if (traj?.riskModifier === 'HIGH') riskPoints += 15;
    if (destination?.difficulty === 'EXTREME') riskPoints += 20;

    let riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskPoints >= 50) riskLevel = 'CRITICAL';
    else if (riskPoints >= 35) riskLevel = 'HIGH';
    else if (riskPoints >= 20) riskLevel = 'ELEVATED';
    else if (riskPoints >= 10) riskLevel = 'MODERATE';

    // Readiness Score (0 to 100)
    let score = 100;
    if (isOverMass) score -= 45;
    if (isOverBudget) score -= 25;
    if (isPowerDeficit) score -= 35;
    else if (powerReservePercent < 20) score -= (20 - powerReservePercent);
    if (isDeltaVDeficit) score -= 35;
    if (!bus) score -= 15;
    if (payloads.length === 0) score -= 30;
    if (!rocket) score -= 20;
    if (!power) score -= 20;
    if (!comms) score -= 15;
    if (!prop) score -= 15;
    if (!traj) score -= 10;
    const readinessScore = Math.max(0, Math.min(100, score));

    return {
      totalMass,
      massLimit,
      isOverMass,
      totalCost,
      budgetLimit,
      isOverBudget,
      powerGenerated,
      powerRequired,
      powerReservePercent,
      isPowerDeficit,
      fuelPercent,
      deltaVAvailable,
      deltaVRequired,
      isDeltaVDeficit,
      totalScience,
      overallReliability,
      riskLevel,
      readinessScore
    };
  }, [state]);

  // MISSION READINESS CHECKS
  const readinessChecks: ReadinessCheck[] = useMemo(() => {
    const checks: ReadinessCheck[] = [];

    // 1. Mass Check
    if (resources.isOverMass) {
      checks.push({
        id: 'chk-mass',
        label: 'Payload Mass Within Launcher Capacity',
        passed: false,
        severity: 'error',
        message: `Spacecraft wet mass (${resources.totalMass.toLocaleString()} kg) exceeds rocket capacity (${resources.massLimit.toLocaleString()} kg).`,
        details: 'Upgrade to a heavier launch vehicle or reduce scientific instrument load.'
      });
    } else {
      checks.push({
        id: 'chk-mass',
        label: 'Payload Mass Within Launcher Capacity',
        passed: true,
        severity: 'success',
        message: `Spacecraft wet mass is ${resources.totalMass.toLocaleString()} kg of ${resources.massLimit.toLocaleString()} kg maximum (${resources.massLimit - resources.totalMass} kg margin).`
      });
    }

    // 2. Budget Check
    if (resources.isOverBudget) {
      checks.push({
        id: 'chk-budget',
        label: 'Total Mission Cost Within Allocated Budget',
        passed: false,
        severity: 'error',
        message: `Total expenditure ($${resources.totalCost}M) exceeds Congressional budget cap ($${resources.budgetLimit}M).`,
        details: 'Select more cost-effective subsystems or fewer instruments.'
      });
    } else {
      checks.push({
        id: 'chk-budget',
        label: 'Total Mission Cost Within Allocated Budget',
        passed: true,
        severity: 'success',
        message: `Total expenditure is $${resources.totalCost}M within the $${resources.budgetLimit}M cap ($${resources.budgetLimit - resources.totalCost}M surplus).`
      });
    }

    // 3. Power Balance Check
    if (resources.isPowerDeficit) {
      checks.push({
        id: 'chk-power',
        label: 'Electrical Power Generation Margin',
        passed: false,
        severity: 'error',
        message: `Power deficit detected: consuming ${resources.powerRequired} W but generating only ${resources.powerGenerated} W.`,
        details: 'Deploy larger solar arrays or an Advanced RTG nuclear system.'
      });
    } else if (resources.powerReservePercent < 20) {
      checks.push({
        id: 'chk-power',
        label: 'Electrical Power Generation Margin',
        passed: true,
        severity: 'warning',
        message: `Marginal power reserve (${resources.powerReservePercent}%). High risk during orbital shadow eclipses.`,
        details: 'Recommend at least 25% power reserve for deep space operations.'
      });
    } else {
      checks.push({
        id: 'chk-power',
        label: 'Electrical Power Generation Margin',
        passed: true,
        severity: 'success',
        message: `Generates ${resources.powerGenerated} W against ${resources.powerRequired} W load (${resources.powerReservePercent}% surplus reserve).`
      });
    }

    // 4. Delta-V Propulsion Check
    if (resources.isDeltaVDeficit) {
      checks.push({
        id: 'chk-deltav',
        label: 'Propulsion Maneuvering Margin (Delta-V)',
        passed: false,
        severity: 'error',
        message: `Propulsion system delivers ${resources.deltaVAvailable} m/s Δv, but destination trajectory requires ${resources.deltaVRequired} m/s.`,
        details: 'Switch to Electric Ion propulsion or an Efficient Transfer trajectory.'
      });
    } else {
      checks.push({
        id: 'chk-deltav',
        label: 'Propulsion Maneuvering Margin (Delta-V)',
        passed: true,
        severity: 'success',
        message: `Sufficient maneuvering capacity: ${resources.deltaVAvailable} m/s delivered vs ${resources.deltaVRequired} m/s required.`
      });
    }

    // 5. Scientific Payload Check
    if (state.payloadIds.length === 0) {
      checks.push({
        id: 'chk-payload',
        label: 'Scientific Instrumentation Package',
        passed: false,
        severity: 'error',
        message: 'No scientific instruments have been integrated onto the spacecraft bus.',
        details: 'Select at least one sensor or camera matching your mission brief.'
      });
    } else {
      checks.push({
        id: 'chk-payload',
        label: 'Scientific Instrumentation Package',
        passed: true,
        severity: 'success',
        message: `${state.payloadIds.length} scientific instruments active. Projected science return score: ${resources.totalScience} pts.`
      });
    }

    // 6. Communications Link Margin
    const comms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId);
    if (!comms) {
      checks.push({
        id: 'chk-comms',
        label: 'Deep Space Communications Link Budget',
        passed: false,
        severity: 'error',
        message: 'Communication antenna has not been selected.',
        details: 'Add an antenna system to transmit science back to Earth.'
      });
    } else if (comms.type === 'LOW_GAIN' && (state.destinationId === 'mars' || state.destinationId === 'asteroid' || state.destinationId === 'jupiter')) {
      checks.push({
        id: 'chk-comms',
        label: 'Deep Space Communications Link Budget',
        passed: true,
        severity: 'warning',
        message: 'Low-gain antenna will suffer severe downlink throttling at interplanetary distances.',
        details: 'Upgrade to High-Gain Cassegrain Dish or Optical Laser Array.'
      });
    } else {
      checks.push({
        id: 'chk-comms',
        label: 'Deep Space Communications Link Budget',
        passed: true,
        severity: 'success',
        message: `Communication link nominal (${comms.dataRateMbps} Mbps downlink capability with DSN ground stations).`
      });
    }

    return checks;
  }, [resources, state]);

  // SIMULATION ENGINE LOGIC
  const launchToPad = useCallback(() => {
    setTelemetry(INITIAL_TELEMETRY);
    setState(prev => {
      const busId = prev.busId || 'bus-standard';
      const payloadIds = prev.payloadIds.length > 0 ? prev.payloadIds : ['inst-camera', 'inst-spectrometer'];
      const launchVehicleId = prev.launchVehicleId || 'launch-medium';
      const powerSystemId = prev.powerSystemId || 'power-medium';
      const commsSystemId = prev.commsSystemId || 'comms-high';
      const propulsionSystemId = prev.propulsionSystemId || 'prop-hybrid';
      const thermalSystemId = prev.thermalSystemId || 'therm-pipes';
      const trajectoryId = prev.trajectoryId || 'traj-balanced';
      const destinationId = prev.destinationId || 'new-eden';

      return {
        ...prev,
        destinationId,
        busId,
        payloadIds,
        launchVehicleId,
        powerSystemId,
        commsSystemId,
        propulsionSystemId,
        thermalSystemId,
        trajectoryId,
        status: 'IN FLIGHT',
        currentStep: 'simulation'
      };
    });
    setIsSimRunning(true);
    setCountdownNumber(10);
    setEventLogs([{
      timestamp: 'T-00:00:10',
      message: 'Terminal countdown sequence initiated. Spacecraft locked to internal flight power.',
      type: 'nominal'
    }]);
  }, []);

  const completeMission = useCallback((manualScore?: number) => {
    setIsSimRunning(false);
    setCountdownNumber(null);
    setActiveDecision(null);

    const comms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId);
    const prop = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId);
    const bus = SPACECRAFT_BUSES.find(b => b.id === state.busId);
    const traj = TRAJECTORY_OPTIONS.find(t => t.id === state.trajectoryId);

    const hasCriticalFail = resources.isOverMass || resources.isPowerDeficit || resources.isDeltaVDeficit;
    const hasMajorWarning = resources.powerReservePercent < 15 || resources.isOverBudget || resources.overallReliability < 92;

    let outcome: 'MISSION SUCCESS' | 'PARTIAL SUCCESS' | 'MISSION FAILURE' = 'MISSION SUCCESS';
    if (hasCriticalFail) {
      outcome = 'MISSION FAILURE';
    } else if (hasMajorWarning) {
      outcome = 'PARTIAL SUCCESS';
    }

    const sciScore = Math.min(100, Math.round((resources.totalScience / 65) * 100));
    const engScore = resources.overallReliability;
    const resScore = Math.max(40, 100 - (resources.isOverBudget ? 30 : 0) - (resources.isOverMass ? 35 : 0) - (resources.powerReservePercent < 20 ? 15 : 0));
    const commScore = comms?.signalReliability || 85;
    const trajScore = traj?.riskModifier === 'LOW' ? 95 : (traj?.riskModifier === 'BALANCED' ? 88 : 74);
    let overall = Math.round((sciScore * 0.3) + (engScore * 0.25) + (resScore * 0.2) + (commScore * 0.15) + (trajScore * 0.1));
    if (typeof manualScore === 'number' && manualScore > 0) {
      overall = Math.round(overall * 0.4 + manualScore * 0.6);
    }

    const whatWentWell: string[] = [];
    const whatCouldImprove: string[] = [];

    if (resources.powerReservePercent >= 25) whatWentWell.push('Robust electrical reserve prevented power shedding during orbital shadow eclipses.');
    if (comms?.type === 'HIGH_GAIN' || comms?.type === 'DEEP_SPACE') whatWentWell.push('High-gain communication link downlinked 100% of telemetry and gigabytes of science imagery without packet loss.');
    if (prop?.efficiency === 'HIGH' || prop?.efficiency === 'ULTRA-HIGH') whatWentWell.push('High specific-impulse propulsion provided outstanding delta-v maneuvering margin.');
    if (resources.readinessScore > 90) whatWentWell.push('Disciplined systems integration passed all Flight Readiness margins with flying colors.');

    if (resources.isOverBudget) whatCouldImprove.push('Mission exceeded initial budget authorization, requiring congressional contingency reserve.');
    if (resources.powerReservePercent < 20) whatCouldImprove.push('Narrow electrical power margin caused thermal sensor throttling during battery recharge.');
    if (comms?.type === 'LOW_GAIN') whatCouldImprove.push('Low-gain antenna bottlenecked science downlink, delaying high-resolution spectrometer analysis.');
    if (resources.isOverMass) whatCouldImprove.push('Excess spacecraft mass reduced launcher apogee margin, risking orbital injection.');

    let criticalDecisionNote = 'Your balanced subsystem selection kept the spacecraft structurally sound while delivering high-value planetary science.';
    if (comms?.type === 'HIGH_GAIN' && state.briefId === 'lunar-polar') {
      criticalDecisionNote = 'The high-gain Cassegrain communication system increased mission cost by $62M but prevented critical data loss when surveying shadowed craters.';
    } else if (prop?.type === 'ELECTRIC') {
      criticalDecisionNote = 'Choosing high-efficiency ion propulsion saved over 1,500 kg of propellant mass, allowing heavy scientific radar integration.';
    } else if (resources.isPowerDeficit) {
      criticalDecisionNote = 'Severe electrical deficit caused instrument shutdowns during destination approach, leading to mission failure.';
    }

    const finalReport: MissionResultReport = {
      outcome,
      scientificReturnScore: sciScore,
      engineeringReliabilityScore: engScore,
      resourceEfficiencyScore: resScore,
      communicationScore: commScore,
      trajectoryEfficiencyScore: trajScore,
      overallScore: overall,
      scienceDataPercent: outcome === 'MISSION FAILURE' ? 24 : (outcome === 'PARTIAL SUCCESS' ? 68 : 96),
      summary: outcome === 'MISSION SUCCESS' 
        ? 'All primary scientific objectives achieved. Spacecraft successfully completed orbital insertion and returned high-fidelity exploratory data.'
        : (outcome === 'PARTIAL SUCCESS' 
            ? 'Mission partially achieved scientific goals. Hardware degraded due to resource constraints or thermal limits, but returned critical data.'
            : 'Catastrophic engineering failure occurred during flight due to unaddressed system deficits. Mission lost.'),
      whatWentWell,
      whatCouldImprove,
      criticalDecisionNote
    };

    setState(s => ({
      ...s,
      status: outcome === 'MISSION FAILURE' ? 'FAILED' : 'COMPLETE',
      currentStep: 'results',
      lastResult: finalReport
    }));

    setTelemetry(prev => ({
      ...prev,
      distanceProgressPercent: 100,
      stageName: 'MISSION COMPLETE — SCIENCE OPERATIONS ARCHIVED'
    }));
  }, [state, resources]);

  const startSimulation = useCallback(() => {
    launchToPad();
  }, [launchToPad]);

  const abortSimulation = useCallback(() => {
    setIsSimRunning(false);
    setCountdownNumber(null);
    setActiveDecision(null);
    setState(prev => ({
      ...prev,
      status: 'DRAFT',
      currentStep: 'review'
    }));
  }, []);

  const resolveDecision = useCallback((optionIndex: number) => {
    if (!activeDecision) return;
    const chosenOption = activeDecision.options[optionIndex];
    setState(prev => ({
      ...prev,
      resolvedDecisions: {
        ...prev.resolvedDecisions,
        [activeDecision.id]: optionIndex
      }
    }));
    setEventLogs(prev => [
      ...prev,
      {
        timestamp: telemetry.missionTime,
        message: `FLIGHT DIRECTOR ACTION: ${chosenOption.label}. ${chosenOption.description}`,
        type: 'nominal'
      }
    ]);
    setActiveDecision(null);
  }, [activeDecision, telemetry.missionTime]);

  // SIMULATION LOOP
  useEffect(() => {
    if (!isSimRunning || state.currentStep !== 'simulation') return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Phase 1: Countdown 10..0
    if (countdownNumber !== null && countdownNumber > 0) {
      timer = setTimeout(() => {
        setCountdownNumber(prev => {
          if (prev === null) return null;
          const nextVal = prev - 1;
          if (nextVal === 0) {
            setEventLogs(logs => [
              ...logs,
              { timestamp: 'T+00:00:00', message: 'MAIN ENGINE IGNITION. Liftoff confirmed!', type: 'nominal' }
            ]);
            return 0;
          }
          return nextVal;
        });
      }, 1000 / simSpeed);
      return () => clearTimeout(timer);
    }

    // Phase 2: Flight progression
    if (countdownNumber === 0 && !activeDecision) {
      timer = setInterval(() => {
        setTelemetry(prev => {
          const nextProgress = prev.distanceProgressPercent + 1.2 * simSpeed;

          // Check for completion
          if (nextProgress >= 100) {
            clearInterval(timer);
            completeMission();
            return {
              ...prev,
              distanceProgressPercent: 100,
              stageName: 'MISSION COMPLETE — SCIENCE OPERATIONS ARCHIVED'
            };
          }

          // Stages & live events
          let stage = 'FIRST STAGE ASCENT';
          let alt = Math.round(prev.altitudeKm + 85 * simSpeed);
          let vel = Number((prev.velocityKms + 0.35 * simSpeed).toFixed(2));
          let fuel = Math.max(0, Math.round(prev.fuelPercent - 0.28 * simSpeed));
          let pwr = Math.round(resources.powerGenerated - (Math.random() * 80));
          let temp = Math.round(prev.tempCelsius + (Math.random() * 2 - 1));
          let signal = resources.overallReliability > 90 ? 98 : 88;

          // Stage transitions & logged events
          if (nextProgress > 15 && prev.distanceProgressPercent <= 15) {
            stage = 'STAGE SEPARATION & FAIRING JETTISON';
            setEventLogs(l => [...l, { timestamp: 'T+02:18', message: 'Booster MECO. Stage separation and payload fairing jettison confirmed.', type: 'nominal' }]);
          } else if (nextProgress > 30 && prev.distanceProgressPercent <= 30) {
            stage = 'EARTH PARKING ORBIT INSERTION';
            alt = 320;
            vel = 7.78;
            setEventLogs(l => [...l, { timestamp: 'T+14:32', message: 'SECO-1 complete. Parking orbit established at 320 km apogee.', type: 'nominal' }]);
          } else if (nextProgress > 45 && prev.distanceProgressPercent <= 45) {
            stage = 'TRANS-INJECTION BURN & SOLAR DEPLOYMENT';
            setEventLogs(l => [...l, { timestamp: 'T+01:12:00', message: 'Trans-injection engine burn nominal. Solar array panels locked and tracking.', type: 'nominal' }]);

            // Dynamic in-flight alert event trigger if power reserve is low!
            if (resources.powerReservePercent < 20 && !state.resolvedDecisions['power-surge']) {
              setActiveDecision({
                id: 'power-surge',
                title: 'CRITICAL IN-FLIGHT POWER ANOMALY',
                description: 'Solar array tracking motor drawing excessive current during transition into penumbral shadow. Battery voltage dipping rapidly.',
                currentMetric: `${resources.powerGenerated} W (Drawing ${resources.powerRequired} W)`,
                requiredMetric: `${resources.powerRequired + 150} W`,
                consequence: 'Risk of avionics computer brownout or science instrument thermal shock.',
                options: [
                  {
                    label: 'THROTTLE SCIENCE SENSORS (SAFEMODE)',
                    description: 'Deactivate high-power radar and thermal sensors to preserve flight computer power bus.',
                    impact: { science: -15, power: +300 }
                  },
                  {
                    label: 'MAINTAIN MAXIMUM POWER DRAIN',
                    description: 'Rely on secondary lithium batteries and push through the shadow crossing at 100% capacity.',
                    impact: { reliability: -12 }
                  }
                ]
              });
            }
          } else if (nextProgress > 65 && prev.distanceProgressPercent <= 65) {
            stage = 'INTERPLANETARY CRUISE & MID-COURSE CORRECTION';
            alt = Math.round(180000 + nextProgress * 2500);
            vel = 11.2;
            setEventLogs(l => [...l, { timestamp: 'T+03:42:11', message: 'TCM-1 Mid-course correction burn executed with high precision.', type: 'nominal' }]);

            // Dynamic in-flight alert event trigger for communications if low-gain!
            const comms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId);
            if (comms?.type === 'LOW_GAIN' && !state.resolvedDecisions['comm-lag']) {
              setActiveDecision({
                id: 'comm-lag',
                title: 'COMMUNICATION LINK DEGRADATION',
                description: 'Deep space telemetry attenuation has dropped carrier signal-to-noise ratio below threshold.',
                currentMetric: 'Signal: 34%',
                requiredMetric: 'Signal: > 60%',
                consequence: 'Ground station lost framing lock on scientific data streams.',
                options: [
                  {
                    label: 'BUFFER DATA LOCALLY IN FLASH STORAGE',
                    description: 'Store high-res imagery internally and wait for optimal Goldstone DSN antenna window.',
                    impact: { science: 0 }
                  },
                  {
                    label: 'DROP IMAGING RESOLUTION BY 50%',
                    description: 'Compress telemetry down to basic housekeeping packets to maintain continuous lock.',
                    impact: { science: -10 }
                  }
                ]
              });
            }
          } else if (nextProgress > 85 && prev.distanceProgressPercent <= 85) {
            stage = 'DESTINATION ORBIT INSERTION & SURVEY';
            setEventLogs(l => [...l, { timestamp: 'T+06:18:32', message: 'Arrival trajectory capture confirmed. High-gain antenna lock achieved.', type: 'nominal' }]);
            setEventLogs(l => [...l, { timestamp: 'T+06:22:15', message: 'Scientific instruments powered on. Downlinking primary observation passes.', type: 'success' }]);
          }

          const hours = Math.floor((nextProgress * 4.2));
          const mins = Math.floor((nextProgress * 25) % 60);
          const timeStr = `T+${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:45`;

          return {
            altitudeKm: alt,
            velocityKms: vel,
            fuelPercent: fuel,
            powerWatts: pwr,
            tempCelsius: temp,
            signalStrength: signal,
            missionTime: timeStr,
            stageName: stage,
            distanceProgressPercent: nextProgress
          };
        });
      }, 500 / simSpeed);

      return () => clearInterval(timer);
    }
  }, [isSimRunning, countdownNumber, activeDecision, simSpeed, state, resources]);

  return (
    <MissionContext.Provider
      value={{
        state,
        resources,
        readinessChecks,
        setStep,
        selectBrief,
        selectDestination,
        selectBus,
        togglePayload,
        selectLaunchVehicle,
        selectPowerSystem,
        selectCommsSystem,
        selectPropulsionSystem,
        selectThermalSystem,
        selectTrajectory,
        setMissionName,
        loadDemoMission,
        resetMission,
        canNavigateToStep,
        cadetMode: state.cadetMode,
        toggleCadetMode,
        autoBalanceMission,
        goToNextStep,
        goToPrevStep,
        isSimRunning,
        simSpeed,
        setSimSpeed,
        activeDecision,
        resolveDecision,
        telemetry,
        eventLogs,
        countdownNumber,
        startSimulation,
        launchToPad,
        abortSimulation,
        completeMission
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
