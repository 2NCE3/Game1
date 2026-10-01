import React from 'react';
import { MissionProvider, useMission } from './context/MissionContext';

import { AISideBot } from './components/common/AISideBot';
import { GlobalNavbar } from './components/layout/GlobalNavbar';
import { MobileBlocker } from './components/common/MobileBlocker';

// Screens
import { StartScreen } from './components/screens/StartScreen';
import { Screen01Brief } from './components/screens/Screen01Brief';
import { Screen02Destination } from './components/screens/Screen02Destination';
import { HangarBuilder } from './components/screens/HangarBuilder';
import { Screen03Spacecraft } from './components/screens/Screen03Spacecraft';
import { Screen04Payload } from './components/screens/Screen04Payload';
import { Screen05LaunchVehicle } from './components/screens/Screen05LaunchVehicle';
import { Screen06Systems } from './components/screens/Screen06Systems';
import { Screen07Trajectory } from './components/screens/Screen07Trajectory';
import { Screen08Review } from './components/screens/Screen08Review';
import { Screen09Simulation } from './components/screens/Screen09Simulation';
import { Screen10Results } from './components/screens/Screen10Results';

import { ThemeProvider, useTheme } from './context/ThemeContext';

import { ErrorBoundary } from './components/common/ErrorBoundary';

const MainLayout: React.FC = () => {
  const { state } = useMission();
  const { theme } = useTheme();

  // Active Screen Selector (Full-screen game viewports)
  const renderScreen = () => {
    switch (state.currentStep) {
      case 'start':
        return <StartScreen />;
      case 'destination':
        return <Screen02Destination />;
      case 'hangar':
        return <HangarBuilder />;
      case 'simulation':
        return <Screen09Simulation />;
      case 'results':
        return <Screen10Results />;
      case 'review':
        return <Screen08Review />;
      case 'brief':
        return <Screen01Brief />;
      case 'spacecraft':
        return <Screen03Spacecraft />;
      case 'payload':
        return <Screen04Payload />;
      case 'launch':
        return <Screen05LaunchVehicle />;
      case 'systems':
        return <Screen06Systems />;
      case 'trajectory':
        return <Screen07Trajectory />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className={`w-screen h-screen flex flex-col ${theme === 'dark' ? 'bg-[#030305] text-[#f5f5f7]' : 'bg-[#f5f5f7] text-[#1d1d1f]'} overflow-hidden font-sans select-none relative transition-colors duration-200`}>
      <MobileBlocker />
      {/* Universal Top Navigation Bar on every page */}
      <GlobalNavbar />

      {/* Screen Viewport */}
      <div className="flex-1 w-full min-h-0 relative overflow-hidden">
        <ErrorBoundary fallbackTitle={`SCREEN FAILURE [${state.currentStep.toUpperCase()}]`}>
          <div key={state.currentStep} className="w-full h-full">
            {renderScreen()}
          </div>
        </ErrorBoundary>
      </div>

      {/* Persistent AI Smart Side Bot Companion */}
      {state.currentStep !== 'start' && <AISideBot />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MissionProvider>
        <MainLayout />
      </MissionProvider>
    </ThemeProvider>
  );
};

export default App;
