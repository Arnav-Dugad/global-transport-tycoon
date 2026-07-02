import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import MapView from './map/MapView';
import { engine } from './game/useEngine';
import { useUI } from './store/uiStore';

import TopBar from './ui/hud/TopBar';
import BottomNav from './ui/hud/BottomNav';
import Alerts from './ui/hud/Alerts';
import StartScreen from './ui/StartScreen';
import Tutorial from './ui/Tutorial';

import BuildPanel from './ui/panels/BuildPanel';
import RoutesPanel from './ui/panels/RoutesPanel';
import FleetPanel from './ui/panels/FleetPanel';
import FinancePanel from './ui/panels/FinancePanel';
import ResearchPanel from './ui/panels/ResearchPanel';
import CityPanel from './ui/panels/CityPanel';
import MenuPanel from './ui/panels/MenuPanel';

export default function App() {
  const phase = useUI((s) => s.phase);
  const panel = useUI((s) => s.panel);
  const buildMode = useUI((s) => s.buildMode);
  const showTutorial = useUI((s) => s.showTutorial);

  // Start the fixed-timestep engine loop once for the whole app lifetime.
  useEffect(() => { engine.start(); return () => engine.stop(); }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-950">
      <MapView />

      {phase === 'playing' && (
        <>
          <TopBar />
          <Alerts />

          {buildMode && panel !== 'build' && (
            <div className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center px-4">
              <div className="gtt-pulse rounded-full border border-accent/40 bg-surface-900/90 px-4 py-2 text-xs font-semibold text-accent-soft shadow-glass backdrop-blur">
                Tap cities on the map to add stops
              </div>
            </div>
          )}

          <AnimatePresence>
            {panel === 'build' && <BuildPanel key="build" />}
            {panel === 'routes' && <RoutesPanel key="routes" />}
            {panel === 'fleet' && <FleetPanel key="fleet" />}
            {panel === 'finance' && <FinancePanel key="finance" />}
            {panel === 'research' && <ResearchPanel key="research" />}
            {panel === 'city' && <CityPanel key="city" />}
            {panel === 'menu' && <MenuPanel key="menu" />}
          </AnimatePresence>

          <BottomNav />
          {showTutorial && <Tutorial />}
        </>
      )}

      {phase === 'start' && <StartScreen />}
    </div>
  );
}
