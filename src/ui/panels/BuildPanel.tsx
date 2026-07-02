import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { routeBuildCost } from '../../game/actions';
import { CITY_BY_ID } from '../../data/cities';
import { MODE_META, type Mode } from '../../data/vehicles';
import { haversineKm } from '../../utils/geo';
import { formatMoney, formatNumber } from '../../utils/format';
import { Button, SectionTitle } from '../atoms';
import Sheet from '../Sheet';

const MODES: Mode[] = ['road', 'rail', 'air', 'sea'];

export default function BuildPanel() {
  const buildMode = useUI((s) => s.buildMode);
  const draftStops = useUI((s) => s.draftStops);
  const startBuild = useUI((s) => s.startBuild);
  const cancelBuild = useUI((s) => s.cancelBuild);
  const toggleDraftStop = useUI((s) => s.toggleDraftStop);
  const closePanel = useUI((s) => s.closePanel);
  const openPanel = useUI((s) => s.openPanel);
  const selectRoute = useUI((s) => s.selectRoute);
  const showToast = useUI((s) => s.showToast);
  const cash = useGame((s) => s.cash);
  const unlockedModes = useGame((s) => s.unlockedModes);

  const totalKm = draftStops.reduce((sum, id, i) => {
    if (i === 0) return 0;
    const a = CITY_BY_ID[draftStops[i - 1]];
    const b = CITY_BY_ID[id];
    return sum + haversineKm([a.lng, a.lat], [b.lng, b.lat]);
  }, 0);

  const cost = buildMode ? routeBuildCost(engine.state, buildMode, draftStops) : 0;
  const canBuild = buildMode != null && draftStops.length >= 2 && cost <= cash;

  const confirm = () => {
    if (!buildMode) return;
    const res = engine.buildRoute(buildMode, draftStops);
    if (res.ok) {
      showToast('Route built! Now add vehicles.');
      cancelBuild();
      selectRoute(res.id ?? null);
      openPanel('routes');
    } else {
      showToast(res.error ?? 'Could not build route.');
    }
  };

  return (
    <Sheet title="Build a Route" emoji="🛠️" onClose={() => { cancelBuild(); closePanel(); }}>
      <SectionTitle>1 · Choose transport mode</SectionTitle>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {MODES.map((m) => {
          const unlocked = unlockedModes.includes(m);
          const active = buildMode === m;
          return (
            <button
              key={m}
              disabled={!unlocked}
              onClick={() => startBuild(m)}
              className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-center transition ${
                active ? 'border-accent bg-accent/15' : 'border-white/10 bg-white/5'
              } ${!unlocked ? 'opacity-35' : 'hover:bg-white/10'}`}
            >
              <span className="text-xl">{MODE_META[m].emoji}</span>
              <span className="text-[11px] font-semibold">{MODE_META[m].name}</span>
              {!unlocked && <span className="text-[9px] text-white/40">🔒</span>}
            </button>
          );
        })}
      </div>

      {buildMode && (
        <>
          <SectionTitle>2 · Tap cities on the map (2–6 stops)</SectionTitle>
          {draftStops.length === 0 ? (
            <div className="mb-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-4 text-center text-xs text-white/55">
              Tap glowing cities on the map to add stops.
              {buildMode === 'sea' && <div className="mt-1 text-white/40">Only coastal cities can be ports.</div>}
            </div>
          ) : (
            <div className="mb-3 space-y-1.5">
              {draftStops.map((id, i) => (
                <div key={id} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-surface-950">{i + 1}</span>
                  <span className="flex-1 text-sm">{CITY_BY_ID[id].name}</span>
                  <span className="text-[11px] text-white/40">{CITY_BY_ID[id].country}</span>
                  <button onClick={() => toggleDraftStop(id)} className="text-white/40 hover:text-danger">✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/5 py-2">
              <div className="text-[10px] uppercase text-white/40">Distance</div>
              <div className="text-sm font-bold">{formatNumber(totalKm)} km</div>
            </div>
            <div className="rounded-xl bg-white/5 py-2">
              <div className="text-[10px] uppercase text-white/40">Stations</div>
              <div className="text-sm font-bold">{new Set(draftStops).size}</div>
            </div>
            <div className="rounded-xl bg-white/5 py-2">
              <div className="text-[10px] uppercase text-white/40">Cost</div>
              <div className={`text-sm font-bold ${cost > cash ? 'text-danger' : 'text-gold'}`}>{formatMoney(cost)}</div>
            </div>
          </div>

          <Button className="w-full" disabled={!canBuild} onClick={confirm}>
            {draftStops.length < 2 ? 'Add at least 2 stops' : cost > cash ? 'Not enough cash' : `Build Route · ${formatMoney(cost)}`}
          </Button>
        </>
      )}
    </Sheet>
  );
}
