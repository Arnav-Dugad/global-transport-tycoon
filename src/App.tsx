import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import MapView from './map/MapView';
import { engine, useGame } from './game/useEngine';
import { useUI } from './store/uiStore';
import { sfx, unlockAudio } from './game/audio';

import TopBar from './ui/hud/TopBar';
import BottomNav from './ui/hud/BottomNav';
import Alerts from './ui/hud/Alerts';
import StartScreen from './ui/StartScreen';
import Tutorial from './ui/Tutorial';
import BuildBar from './ui/BuildBar';

import RoutesPanel from './ui/panels/RoutesPanel';
import FleetPanel from './ui/panels/FleetPanel';
import FinancePanel from './ui/panels/FinancePanel';
import ResearchPanel from './ui/panels/ResearchPanel';
import ContractsPanel from './ui/panels/ContractsPanel';
import CityPanel from './ui/panels/CityPanel';
import VehiclePanel from './ui/panels/VehiclePanel';
import MenuPanel from './ui/panels/MenuPanel';

/** Plays a subtle coin sound when deliveries happen (throttled). */
function SoundDriver() {
  const trips = useGame((s) => s.stats.totalTrips);
  const lastTrips = useRef(trips);
  const lastPlay = useRef(0);
  useEffect(() => {
    if (trips > lastTrips.current) {
      const now = performance.now();
      if (now - lastPlay.current > 1200) { sfx.coin(); lastPlay.current = now; }
    }
    lastTrips.current = trips;
  }, [trips]);
  return null;
}

export default function App() {
  const phase = useUI((s) => s.phase);
  const panel = useUI((s) => s.panel);
  const buildMode = useUI((s) => s.buildMode);
  const selectedVehicle = useUI((s) => s.selectedVehicle);
  const showTutorial = useUI((s) => s.showTutorial);

  // Start the fixed-timestep engine loop once for the whole app lifetime.
  useEffect(() => { engine.start(); return () => engine.stop(); }, []);

  // Unlock WebAudio on the first user gesture (mobile autoplay policy).
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-950">
      <MapView />

      {phase === 'playing' && (
        <>
          <TopBar />
          <Alerts />
          <SoundDriver />

          <AnimatePresence>
            {panel === 'routes' && <RoutesPanel key="routes" />}
            {panel === 'fleet' && <FleetPanel key="fleet" />}
            {panel === 'finance' && <FinancePanel key="finance" />}
            {panel === 'research' && <ResearchPanel key="research" />}
            {panel === 'contracts' && <ContractsPanel key="contracts" />}
            {panel === 'city' && <CityPanel key="city" />}
            {panel === 'menu' && <MenuPanel key="menu" />}
            {selectedVehicle && <VehiclePanel key="vehicle" />}
            {buildMode && <BuildBar key="buildbar" />}
          </AnimatePresence>

          {/* Nav hides while building so the map gets full screen space. */}
          {!buildMode && <BottomNav />}
          {showTutorial && <Tutorial />}
        </>
      )}

      {phase === 'start' && <StartScreen />}
    </div>
  );
}
