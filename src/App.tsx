import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { MissionProvider, useMission } from './context/MissionContext';

import { AISideBot } from './components/common/AISideBot';

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
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile_frame'>('desktop');

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
    <div className={`w-screen h-screen ${theme === 'dark' ? 'bg-space-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden font-sans select-none relative transition-colors duration-300 flex items-center justify-center`}>
      {/* Device Mode Switcher Floating in Top-Right corner */}
      <button
        onClick={() => setDeviceMode(prev => prev === 'desktop' ? 'mobile_frame' : 'desktop')}
        className="fixed top-3 right-3 z-50 px-2.5 py-1.5 rounded-full bg-space-900/90 hover:bg-space-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-105"
        title="Toggle between Desktop Fullscreen and Mobile Phone (9:16) viewport"
      >
        {deviceMode === 'desktop' ? (
          <>
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PHONE (9:16)</span>
          </>
        ) : (
          <>
            <Monitor className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </>
        )}
      </button>

      {deviceMode === 'mobile_frame' ? (
        <div className="w-full max-w-[430px] h-[94vh] max-h-[880px] bg-space-950 rounded-[44px] shadow-2xl border-4 border-slate-700/80 overflow-hidden relative flex flex-col ring-1 ring-slate-500/20">
          {/* Dynamic Island Speaker Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 pointer-events-none border border-slate-800/80 flex items-center justify-end px-3">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          <div className="flex-1 w-full h-full overflow-hidden relative pt-6">
            <ErrorBoundary fallbackTitle={`SCREEN FAILURE [${state.currentStep.toUpperCase()}]`}>
              <div key={state.currentStep} className="w-full h-full">
                {renderScreen()}
              </div>
            </ErrorBoundary>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <ErrorBoundary fallbackTitle={`SCREEN FAILURE [${state.currentStep.toUpperCase()}]`}>
            <div key={state.currentStep} className="w-full h-full">
              {renderScreen()}
            </div>
          </ErrorBoundary>
        </div>
      )}

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
