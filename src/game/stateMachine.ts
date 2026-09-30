// Game Phase State Machine
// Coordinates progression: Hangar -> Launch -> Cruise -> Arrival -> Results

import { GamePhase, LaunchEvaluation } from './types';

export interface GameStateMachineState {
  currentPhase: GamePhase;
  launchEvaluation: LaunchEvaluation | null;
  cruiseEvaluation: Record<string, unknown> | null;
  arrivalEvaluation: Record<string, unknown> | null;
  finalScore: number;
}

export type StateMachineListener = (state: GameStateMachineState) => void;

class GameStateMachine {
  private state: GameStateMachineState = {
    currentPhase: 'hangar',
    launchEvaluation: null,
    cruiseEvaluation: null,
    arrivalEvaluation: null,
    finalScore: 0,
  };

  private listeners: Set<StateMachineListener> = new Set();

  getState(): GameStateMachineState {
    return { ...this.state };
  }

  subscribe(listener: StateMachineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  setPhase(phase: GamePhase) {
    this.state.currentPhase = phase;
    this.notify();
  }

  recordLaunchResult(evaluation: LaunchEvaluation) {
    this.state.launchEvaluation = evaluation;
    if (evaluation.success) {
      this.state.currentPhase = 'cruise';
    }
    this.notify();
  }

  recordCruiseResult(evaluation: Record<string, unknown>) {
    this.state.cruiseEvaluation = evaluation;
    this.state.currentPhase = 'arrival';
    this.notify();
  }

  recordArrivalResult(evaluation: Record<string, unknown>, finalScore: number) {
    this.state.arrivalEvaluation = evaluation;
    this.state.finalScore = finalScore;
    this.state.currentPhase = 'results';
    this.notify();
  }

  resetToHangar() {
    this.state = {
      currentPhase: 'hangar',
      launchEvaluation: null,
      cruiseEvaluation: null,
      arrivalEvaluation: null,
      finalScore: 0,
    };
    this.notify();
  }
}

export const gameStateMachine = new GameStateMachine();
