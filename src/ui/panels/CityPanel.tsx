import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { CITY_BY_ID } from '../../data/cities';
import { CARGO_BY_ID } from '../../data/cargo';
import { MODE_META, type Mode } from '../../data/vehicles';
import { BALANCE } from '../../game/balance';
import { formatMoney, formatNumber } from '../../utils/format';
import { Button, Chip, SectionTitle, Stat } from '../atoms';
import Sheet from '../Sheet';

export default function CityPanel() {
  const selectedCity = useUI((s) => s.selectedCity);
  const selectCity = useUI((s) => s.selectCity);
  const startBuild = useUI((s) => s.startBuild);
  const toggleDraftStop = useUI((s) => s.toggleDraftStop);
  const showToast = useUI((s) => s.showToast);
  useGame((s) => s.time); // subscribe for live stock/pop updates

  if (!selectedCity) return null;
  const meta = CITY_BY_ID[selectedCity];
  const city = engine.state.cities[selectedCity];
  if (!meta || !city) return null;

  const stations = Object.values(engine.state.stations).filter((s) => s.cityId === selectedCity);
  const topStock = Object.entries(city.stock)
    .filter(([, n]) => n >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <Sheet title={meta.name} emoji="📍" onClose={() => selectCity(null)}>
      <div className="mb-3 text-xs text-white/50">{meta.country}{meta.coastal ? ' · 🌊 Coastal (port capable)' : ''}</div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <Stat label="Population" value={`${city.population.toFixed(1)}M`} sub={city.population > meta.pop ? '📈 growing' : undefined} />
        <Stat label="Satisfaction" value={`${Math.round(city.satisfaction * 100)}%`} accent={city.satisfaction > 0.6 ? '#7ee081' : city.satisfaction > 0.3 ? '#ffcf5c' : '#ff5c7a'} />
      </div>

      <SectionTitle>Produces</SectionTitle>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Chip color="#5ff0d4">🧑 Passengers</Chip>
        <Chip color="#c6b3ff">✉️ Mail</Chip>
        {city.produces.map((c) => <Chip key={c} color={CARGO_BY_ID[c]?.color}>{CARGO_BY_ID[c]?.emoji} {CARGO_BY_ID[c]?.name}</Chip>)}
      </div>

      <SectionTitle>In demand</SectionTitle>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Chip color="#5ff0d4">🧑 Passengers</Chip>
        {city.demands.map((c) => <Chip key={c} color={CARGO_BY_ID[c]?.color}>{CARGO_BY_ID[c]?.emoji} {CARGO_BY_ID[c]?.name}</Chip>)}
      </div>

      {topStock.length > 0 && (
        <>
          <SectionTitle>Waiting to ship</SectionTitle>
          <div className="mb-3 space-y-1">
            {topStock.map(([c, n]) => (
              <div key={c} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 text-sm">
                <span>{CARGO_BY_ID[c]?.emoji} {CARGO_BY_ID[c]?.name}</span>
                <span className="font-semibold tabular-nums text-white/70">{formatNumber(n)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {stations.length > 0 && (
        <>
          <SectionTitle>Your stations</SectionTitle>
          <div className="mb-3 space-y-1.5">
            {stations.map((st) => {
              const cost = Math.round(BALANCE.stationCost[st.mode as Mode] * st.level * BALANCE.stationUpgradeCostMult);
              return (
                <div key={st.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <span>{MODE_META[st.mode].emoji}</span>
                  <span className="flex-1 text-sm">{MODE_META[st.mode].name} · Lv {st.level}</span>
                  {st.level < 3 ? (
                    <Button variant="ghost" className="px-2 py-1 text-[11px]" onClick={() => { const r = engine.upgradeStation(st.cityId, st.mode); showToast(r.ok ? 'Station upgraded!' : r.error ?? ''); }}>
                      Upgrade {formatMoney(cost)}
                    </Button>
                  ) : <span className="text-[11px] text-accent">MAX</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      <Button
        className="w-full"
        onClick={() => { startBuild('road'); toggleDraftStop(selectedCity); showToast('Now tap another city to connect.'); }}
      >
        🛠️ Start a route from {meta.name}
      </Button>
    </Sheet>
  );
}
