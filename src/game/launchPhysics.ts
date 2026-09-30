import { LaunchControls, LaunchShipSpecs, LaunchTelemetry } from './types';
import { MissionState, MissionResources } from '../types/mission';
import { LAUNCH_VEHICLES } from '../data/missionsData';

export function createShipSpecsFromMission(state: MissionState, resources: MissionResources): LaunchShipSpecs {
  const rocket = LAUNCH_VEHICLES.find(r => r.id === state.launchVehicleId) || LAUNCH_VEHICLES[1];
  return {
    spacecraftMassKg: Math.max(500, resources.totalMass),
    launcherId: rocket.id,
    launcherName: rocket.name,
    maxPayloadKg: rocket.payloadCapacity,
    thrustKn: rocket.thrustKn,
    boosterBurnTimeSec: 46,
    upperStageBurnTimeSec: 62,
    upperStageThrustKn: Math.round(rocket.thrustKn * 0.24),
    fairingMassKg: Math.round(rocket.payloadCapacity * 0.1),
    heatResistance: 1.0,
  };
}

export function getInitialLaunchTelemetry(specs: LaunchShipSpecs): LaunchTelemetry {
  const initialTwr = (specs.thrustKn * 1000) / (specs.spacecraftMassKg * 9.81 * 3.5);

  return {
    altitudeKm: 0,
    velocityMs: 0,
    mach: 0,
    verticalSpeedMs: 0,
    horizontalSpeedMs: 0,

    pitchDeg: 0,
    targetPitchDeg: 0,
    pitchErrorDeg: 0,
    inArcCorridor: true,

    throttle: 0,
    currentThrustKn: 0,
    twr: Math.max(1.1, Math.min(3.2, initialTwr)),
    stage: 1,
    boosterFuelPercent: 100,
    upperStageFuelPercent: 100,
    stagingReady: false,
    staged: false,
    fairingJettisoned: false,

    airDensity: 1.225,
    dynamicPressureKpa: 0,
    inMaxQZone: false,
    maxQPassed: false,
    maxQThrottleDownScore: 100,

    structuralIntegrity: 100,
    thermalHeat: 0,
    shakeIntensity: 0,
    overheating: false,
    payloadSecured: true,

    flightTimeSec: 0,
    orbitAchieved: false,
    failed: false,
    commanderCallout: 'Hold SPACE or THROTTLE button to roar into the sky! Keep the nose centered on the green arc.',

    arcAccuracyScore: 100,
    maxQHandlingScore: 100,
    stagingTimingScore: 100,
    fuelRemainingPercent: 100,
    totalLaunchScore: 100,
  };
}

export function updateLaunchPhysics(
  prev: LaunchTelemetry,
  controls: LaunchControls,
  dt: number,
  specs: LaunchShipSpecs
): LaunchTelemetry {
  if (prev.failed || prev.orbitAchieved) {
    return prev;
  }

  const flightTime = prev.flightTimeSec + dt;
  const currentThrottle = Math.max(0, Math.min(1, controls.throttle));

  // 1. Air density model (Exponential barometric formula)
  // Scale height H ~ 7.5 km. At 75 km, density is near zero.
  const airDensity = Math.max(0, 1.225 * Math.exp(-prev.altitudeKm / 7.2));

  // 2. Target Gravity Turn Arc calculation
  // Target pitch: 0 deg at pad, pitches over smoothly to 90 deg (horizontal) at 100 km
  let targetPitch = 0;
  if (prev.altitudeKm >= 1.5) {
    const normH = Math.min(1, Math.max(0, (prev.altitudeKm - 1.5) / 95));
    targetPitch = Math.min(90, Math.round(90 * Math.pow(normH, 0.58) * 10) / 10);
  }

  // 3. Attitude & Pitch Control (Steering gimbal)
  let pitch = prev.pitchDeg;
  const gimbalRate = 18; // deg per second
  if (controls.tiltRight) {
    pitch = Math.min(95, pitch + gimbalRate * dt);
  } else if (controls.tiltLeft) {
    pitch = Math.max(0, pitch - gimbalRate * dt);
  } else if (prev.altitudeKm > 2 && currentThrottle > 0.1) {
    // Natural aerodynamic gravity turn tendency nudging towards target
    const naturalTurnRate = 2.5 * dt;
    if (pitch < targetPitch) {
      pitch = Math.min(targetPitch, pitch + naturalTurnRate);
    }
  }

  const pitchError = Math.abs(pitch - targetPitch);
  const inCorridor = pitchError <= 9;

  // 4. Staging Mechanics
  let stage = prev.stage;
  let boosterFuel = prev.boosterFuelPercent;
  let upperFuel = prev.upperStageFuelPercent;
  let stagingReady = prev.stagingReady;
  let staged = prev.staged;
  let stagingTimingScore = prev.stagingTimingScore;

  // Burn fuel based on active stage and throttle
  if (stage === 1) {
    const boosterBurnRate = (100 / Math.max(30, specs.boosterBurnTimeSec)) * currentThrottle;
    boosterFuel = Math.max(0, boosterFuel - boosterBurnRate * dt);

    if (boosterFuel <= 0.05) {
      boosterFuel = 0;
      stagingReady = true;
    }

    // Manual staging trigger
    if (controls.triggerStaging) {
      if (stagingReady) {
        // Successful staging at burnout!
        stage = 2;
        staged = true;
        stagingReady = false;
        stagingTimingScore = 100;
      } else if (boosterFuel < 25) {
        // Slightly early staging
        stage = 2;
        staged = true;
        stagingTimingScore = 75;
      } else {
        // Premature staging jettisons live fuel!
        return {
          ...prev,
          failed: true,
          failureReason: 'Premature Stage Separation',
          failureScientificExplanation:
            'Stage 1 was jettisoned with over 25% propellant unspent! The upper stage alone lacks sufficient Delta-V to reach orbit from this altitude.',
          commanderCallout: 'Mayday! You staged while the main booster was still firing!',
        };
      }
    }
  } else {
    // Stage 2 burn
    const upperBurnRate = (100 / Math.max(35, specs.upperStageBurnTimeSec)) * currentThrottle;
    upperFuel = Math.max(0, upperFuel - upperBurnRate * dt);
  }

  // 5. Mass Calculation (Payload + Stages + Fuel remaining)
  const fairingJettisoned = prev.fairingJettisoned || prev.altitudeKm >= 65;
  const fairingMass = fairingJettisoned ? 0 : specs.fairingMassKg;

  // Spacecraft mass scaling impact:
  // If player overloaded the rocket, mass is higher, lowering acceleration!
  const boosterDryMass = 12000;
  const boosterPropellantMass = 80000 * (boosterFuel / 100);
  const upperDryMass = 4000;
  const upperPropellantMass = 25000 * (upperFuel / 100);

  let currentMassKg = specs.spacecraftMassKg + fairingMass + upperDryMass + upperPropellantMass;
  if (stage === 1) {
    currentMassKg += boosterDryMass + boosterPropellantMass;
  }

  // 6. Thrust Calculation
  let thrustKn = 0;
  if (stage === 1 && boosterFuel > 0) {
    thrustKn = specs.thrustKn * currentThrottle;
  } else if (stage === 2 && upperFuel > 0) {
    thrustKn = specs.upperStageThrustKn * currentThrottle;
  }

  const thrustN = thrustKn * 1000;
  const g0 = 9.80665;
  const twr = currentMassKg > 0 ? thrustN / (currentMassKg * g0) : 0;

  // 7. Aerodynamics (Dynamic Pressure & Drag)
  const v = prev.velocityMs;
  const dynamicPressurePa = 0.5 * airDensity * (v * v);
  const dynamicPressureKpa = dynamicPressurePa / 1000;

  const inMaxQ = prev.altitudeKm >= 9 && prev.altitudeKm <= 20;
  const maxQPassed = prev.altitudeKm > 21;

  // Drag force Fd = 0.5 * rho * v^2 * Cd * A
  const cd = fairingJettisoned ? 0.45 : 0.28;
  const area = 12.0; // rocket frontal cross section in m^2
  const dragN = 0.5 * airDensity * (v * v) * cd * area;

  // 8. Kinematics Update (2D Gravity Turn Physics)
  const pitchRad = (pitch * Math.PI) / 180;
  const netThrustAlongRocket = Math.max(0, thrustN - dragN);

  // Accelerations
  const ax = (netThrustAlongRocket / currentMassKg) * Math.sin(pitchRad);
  const ay = (netThrustAlongRocket / currentMassKg) * Math.cos(pitchRad) - g0;

  let vx = prev.horizontalSpeedMs + ax * dt;
  let vy = prev.verticalSpeedMs + ay * dt;

  // Pad clamp: cannot drop below 0 altitude or negative vertical speed on pad
  if (prev.altitudeKm <= 0 && vy < 0) {
    vy = 0;
    vx = 0;
  }

  const speedMs = Math.sqrt(vx * vx + vy * vy);
  const mach = Math.round((speedMs / 330) * 10) / 10;
  const nextAltKm = Math.max(0, prev.altitudeKm + (vy * dt) / 1000);

  // 9. Aerodynamic Stress, Max-Q Score & Structural Integrity
  let integrity = prev.structuralIntegrity;
  let thermalHeat = prev.thermalHeat;
  let shake = Math.min(1, (dynamicPressureKpa / 40) * currentThrottle + (currentThrottle > 0.8 ? 0.15 : 0));
  let maxQScore = prev.maxQHandlingScore;

  if (inMaxQ) {
    // If throttle is high during Max-Q, excessive aero stress damages the airframe!
    if (dynamicPressureKpa > 34) {
      const damageRate = (dynamicPressureKpa - 34) * 2.8 * dt;
      integrity = Math.max(0, integrity - damageRate);
      thermalHeat = Math.min(100, thermalHeat + 12 * dt);
      shake = 0.85;
      maxQScore = Math.max(40, maxQScore - 15 * dt);
    } else if (currentThrottle <= 0.65) {
      // Good throttle down at Max-Q rewarded!
      maxQScore = Math.min(100, maxQScore + 5 * dt);
    }
  } else if (prev.altitudeKm > 20) {
    thermalHeat = Math.max(0, thermalHeat - 8 * dt);
  }

  // Aerodynamic shear damage if pitching too hard in dense air
  if (prev.altitudeKm < 15 && pitchError > 18 && speedMs > 250) {
    integrity = Math.max(0, integrity - 8 * dt);
    shake = 0.9;
  }

  // 10. Arc Accuracy Score accumulation
  let arcScore = prev.arcAccuracyScore;
  if (prev.altitudeKm > 3) {
    if (inCorridor) {
      arcScore = Math.min(100, arcScore + 1.2 * dt);
    } else {
      arcScore = Math.max(20, arcScore - pitchError * 0.4 * dt);
    }
  }

  // 11. Commander Nova Tactical Radio Callouts
  let callout = prev.commanderCallout;
  if (prev.altitudeKm < 1 && currentThrottle > 0.7) {
    callout = 'LIFTOFF! Maintain full power! Clear the launch tower!';
  } else if (inMaxQ && currentThrottle > 0.65) {
    callout = 'WARNING: Passing Max-Q! Throttle down to 50% to ease aerodynamic stress on the airframe!';
  } else if (inMaxQ && currentThrottle <= 0.65) {
    callout = 'Excellent throttle management through Max-Q. Aerodynamic pressures are nominal.';
  } else if (maxQPassed && !prev.maxQPassed) {
    callout = 'Cleared maximum dynamic pressure! Full throttle authorized. Pitch into the gravity turn!';
  } else if (stagingReady && !staged) {
    callout = 'STAGE 1 BURNOUT! Press the STAGE button now to ignite the upper stage!';
  } else if (staged && prev.altitudeKm > 65 && !prev.fairingJettisoned) {
    callout = 'Altitude 65 km: Atmosphere cleared. Payload fairings jettisoned! Spacecraft exposed to vacuum.';
  } else if (prev.altitudeKm > 80 && vx > 6500) {
    callout = 'Approaching orbital velocity! Horizontal burn is locking in parking orbit.';
  }

  // 12. Check Failure Conditions
  if (integrity <= 0) {
    return {
      ...prev,
      failed: true,
      structuralIntegrity: 0,
      failureReason: 'Structural Breakup at Max-Q',
      failureScientificExplanation:
        'Extreme aerodynamic pressure (Q > 38 kPa) tore the rocket airframe apart. Real space launches (like Saturn V, Falcon 9, and SLS) always throttle down to ~55% between 10-18 km altitude to survive atmospheric density.',
      commanderCallout: 'Catastrophic structural failure! The dynamic pressure was too intense!',
    };
  }

  if (prev.altitudeKm > 8 && vy < -30 && nextAltKm < 5) {
    return {
      ...prev,
      failed: true,
      failureReason: 'Gravity Loss & Ground Impact',
      failureScientificExplanation:
        'The rocket lost upward momentum due to insufficient Thrust-to-Weight Ratio or excessive pitch angle, falling back into the lower atmosphere.',
      commanderCallout: 'Rocket velocity insufficient to sustain ascent! Loss of vehicle.',
    };
  }

  if (stage === 2 && upperFuel <= 0 && vx < 7200 && nextAltKm > 40) {
    return {
      ...prev,
      failed: true,
      failureReason: 'Failed to Reach Orbital Velocity',
      failureScientificExplanation:
        `Propellant exhausted at ${Math.round(vx)} m/s (orbital speed requires ~7,800 m/s). The spacecraft mass was too heavy for this rocket configuration to reach orbit. Upgrade your launcher or lighten your instruments in the Hangar!`,
      commanderCallout: 'Upper stage depleted before orbital velocity was reached. Suborbital trajectory.',
    };
  }

  // 13. Check Win Condition: Stable Low Earth Orbit Achieved!
  // Altitude >= 100 km and horizontal velocity >= 7,600 m/s
  let orbitAchieved: boolean = prev.orbitAchieved;
  if (nextAltKm >= 100 && vx >= 7600) {
    orbitAchieved = true;
    callout = 'ORBIT ACHIEVED! Welcome to space! Main engine cutoff (SECO) confirmed. Parking orbit established!';
  }

  const fuelLeft = stage === 1 ? (boosterFuel * 0.7 + upperFuel * 0.3) : upperFuel;
  const totalScore = Math.round(arcScore * 0.4 + maxQScore * 0.35 + stagingTimingScore * 0.25);

  return {
    altitudeKm: Math.round(nextAltKm * 100) / 100,
    velocityMs: Math.round(speedMs),
    mach,
    verticalSpeedMs: Math.round(vy),
    horizontalSpeedMs: Math.round(vx),

    pitchDeg: Math.round(pitch * 10) / 10,
    targetPitchDeg: targetPitch,
    pitchErrorDeg: Math.round(pitchError * 10) / 10,
    inArcCorridor: inCorridor,

    throttle: currentThrottle,
    currentThrustKn: Math.round(thrustKn),
    twr: Math.round(twr * 100) / 100,
    stage,
    boosterFuelPercent: Math.round(boosterFuel * 10) / 10,
    upperStageFuelPercent: Math.round(upperFuel * 10) / 10,
    stagingReady,
    staged,
    fairingJettisoned,

    airDensity: Math.round(airDensity * 1000) / 1000,
    dynamicPressureKpa: Math.round(dynamicPressureKpa * 10) / 10,
    inMaxQZone: inMaxQ,
    maxQPassed,
    maxQThrottleDownScore: Math.round(maxQScore),

    structuralIntegrity: Math.max(0, Math.round(integrity)),
    thermalHeat: Math.round(thermalHeat),
    shakeIntensity: Math.round(shake * 100) / 100,
    overheating: thermalHeat > 75,
    payloadSecured: integrity > 25,

    flightTimeSec: Math.round(flightTime * 10) / 10,
    orbitAchieved,
    failed: false,
    commanderCallout: callout,

    arcAccuracyScore: Math.round(arcScore),
    maxQHandlingScore: Math.round(maxQScore),
    stagingTimingScore: Math.round(stagingTimingScore),
    fuelRemainingPercent: Math.round(fuelLeft),
    totalLaunchScore: totalScore,
  };
}
