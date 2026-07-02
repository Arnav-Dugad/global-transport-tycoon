import { motion } from 'framer-motion';
import { useUI } from '../store/uiStore';
import { engine, useGame } from '../game/useEngine';
import { routeBuildCost } from '../game/actions';
import { CITY_BY_ID } from '../data/cities';
import { MODE_META, type Mode } from '../data/vehicles';
import { haversineKm } from '../utils/geo';
import { formatMoney, formatNumber } from '../utils/format';
import { sfx } from '../game/audio';

const MODES: Mode[] = ['road', 'rail', 'air', 'sea'];

/**
 * Compact docked route builder. Sits where the nav bar normally is so the whole
 * map stays visible while the player taps cities.
 */
export default function BuildBar() {
  const buildMode = useUI((s) => s.buildMode);
  const draftStops = useUI((s) => s.draftStops);
  const startBuild = useUI((s) => s.startBuild);
  const cancelBuild = useUI((s) => s.cancelBuild);
  const toggleDraftStop = useUI((s) => s.toggleDraftStop);
  const openPanel = useUI((s) => s.openPanel);
  const selectRoute = useUI((s) => s.selectRoute);
  const showToast = useUI((s) => s.showToast);
  const cash = useGame((s) => s.cash);
  const unlockedModes = useGame((s) => s.unlockedModes);

  if (!buildMode) return null;

  const totalKm = draftStops.reduce((sum, id, i) => {
    if (i === 0) return 0;
    const a = CITY_BY_ID[draftStops[i - 1]];
    const b = CITY_BY_ID[id];
    return sum + haversineKm([a.lng, a.lat], [b.lng, b.lat]);
  }, 0);
  const cost = routeBuildCost(engine.state, buildMode, draftStops);
  const canBuild = draftStops.length >= 2 && cost <= cash;

  const confirm = () => {
    const res = engine.buildRoute(buildMode, draftStops);
    if (res.ok) {
      sfx.coin();
      showToast('Route built! Now add vehicles.');
      cancelBuild();
      selectRoute(res.id ?? null);
      openPanel('routes');
    } else {
      sfx.error();
      showToast(res.error ?? 'Could not build route.');
    }
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 40 }}
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 flex justify-center px-2"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-accent/30 bg-surface-900/90 p-2 shadow-glass backdrop-blur-xl">
        {/* Mode row */}
        <div className="flex items-center gap-1.5">
          <div className="flex flex-1 gap-1">
            {MODES.map((m) => {
              const unlocked = unlockedModes.includes(m);
              const active = buildMode === m;
              return (
                <button
                  key={m}
                  disabled={!unlocked}
                  onClick={() => { sfx.click(); startBuild(m); }}
                  className={`flex flex-1 flex-col items-center rounded-lg py-1.5 text-center transition ${
                    active ? 'bg-accent/20 text-accent-soft ring-1 ring-accent/50' : 'bg-white/5 text-white/70'
                  } ${!unlocked ? 'opacity-30' : 'hover:bg-white/10'}`}
                >
                  <span className="text-base leading-none">{MODE_META[m].emoji}</span>
                  <span className="text-[9px] font-semibold">{unlocked ? MODE_META[m].name : '🔒'}</span>
                </button>
              );
            })}
          </div>
          <button onClick={cancelBuild} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-white/70 hover:bg-white/15">✕</button>
        </div>

        {/* Draft chips */}
        {draftStops.length > 0 ? (
          <div className="gtt-scroll mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {draftStops.map((id, i) => (
              <button
                key={id}
                onClick={() => toggleDraftStop(id)}
                className="flex shrink-0 items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11px]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-surface-950">{i + 1}</span>
                {CITY_BY_ID[id].name}
                <span className="text-white/40">✕</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-center text-[11px] text-accent-soft gtt-pulse">
            Tap {MODE_META[buildMode].emoji} cities on the map to add stops{buildMode === 'sea' ? ' (coastal only)' : ''}
          </div>
        )}

        {/* Confirm row */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 text-[11px] tabular-nums text-white/60">
            {draftStops.length} stops · {formatNumber(totalKm)} km · <span className={cost > cash ? 'text-danger' : 'text-gold'}>{formatMoney(cost)}</span>
          </div>
          <button
            disabled={!canBuild}
            onClick={confirm}
            className="min-w-[104px] rounded-xl bg-accent px-4 py-2 text-sm font-bold text-surface-950 shadow-glow transition active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          >
            {draftStops.length < 2 ? 'Add 2+ stops' : cost > cash ? 'Need cash' : 'Build ✓'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
