import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { CITY_BY_ID } from '../../data/cities';
import { MODE_META, VEHICLE_MODELS, MODEL_BY_ID } from '../../data/vehicles';
import { formatMoney } from '../../utils/format';
import { Button, Card, EmptyState, SectionTitle, Chip } from '../atoms';
import Sheet from '../Sheet';

export default function RoutesPanel() {
  const closePanel = useUI((s) => s.closePanel);
  const selectRoute = useUI((s) => s.selectRoute);
  const selectedRoute = useUI((s) => s.selectedRoute);
  const startBuild = useUI((s) => s.startBuild);
  const showToast = useUI((s) => s.showToast);

  const routes = useGame((s) => Object.values(s.routes));
  const vehicles = useGame((s) => Object.values(s.vehicles));
  const cash = useGame((s) => s.cash);
  const unlockedTech = useGame((s) => s.unlockedTech);

  const detail = selectedRoute ? engine.state.routes[selectedRoute] : null;

  if (detail) {
    const routeVehicles = vehicles.filter((v) => v.routeId === detail.id);
    const income = routeVehicles.reduce((a, v) => a + v.totalIncome, 0);
    const buyable = VEHICLE_MODELS.filter(
      (m) => m.mode === detail.mode && (!m.tech || unlockedTech.includes(m.tech)),
    );

    return (
      <Sheet title={detail.name} emoji={MODE_META[detail.mode].emoji} accent={detail.color} onClose={() => selectRoute(null)}>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {detail.stops.map((id, i) => (
            <span key={id} className="flex items-center gap-1">
              {i > 0 && <span className="text-white/30">→</span>}
              <Chip color={detail.color}>{CITY_BY_ID[id].name}</Chip>
            </span>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/5 py-2"><div className="text-[10px] uppercase text-white/40">Vehicles</div><div className="text-sm font-bold">{routeVehicles.length}</div></div>
          <div className="rounded-xl bg-white/5 py-2"><div className="text-[10px] uppercase text-white/40">Earned</div><div className="text-sm font-bold text-accent">{formatMoney(income)}</div></div>
          <div className="rounded-xl bg-white/5 py-2"><div className="text-[10px] uppercase text-white/40">Mode</div><div className="text-sm font-bold">{MODE_META[detail.mode].name}</div></div>
        </div>

        <SectionTitle>Add vehicles</SectionTitle>
        <div className="mb-4 space-y-2">
          {buyable.map((m) => {
            const affordable = cash >= m.price;
            return (
              <Card key={m.id} className="flex items-center gap-3">
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-[11px] text-white/50">
                    {m.carries === 'pax' ? '👤 Passengers' : '📦 Freight'} · cap {m.capacity} · {m.speed} km/h
                  </div>
                </div>
                <Button
                  variant={affordable ? 'primary' : 'ghost'}
                  disabled={!affordable}
                  onClick={() => {
                    const r = engine.buyVehicle(m.id, detail.id);
                    showToast(r.ok ? `${m.name} added to route.` : r.error ?? 'Cannot buy.');
                  }}
                  className="px-3 py-2 text-xs"
                >
                  {formatMoney(m.price)}
                </Button>
              </Card>
            );
          })}
        </div>

        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            const r = engine.removeRoute(detail.id);
            if (r.ok) { showToast('Route removed, vehicles sold back.'); selectRoute(null); }
          }}
        >
          Delete route & sell its vehicles
        </Button>
      </Sheet>
    );
  }

  return (
    <Sheet title="Routes" emoji="🧭" onClose={closePanel}>
      {routes.length === 0 ? (
        <EmptyState icon="🗺️" title="No routes yet" hint="Build your first route to start moving cargo and passengers." />
      ) : (
        <div className="space-y-2">
          {routes.map((r) => {
            const count = vehicles.filter((v) => v.routeId === r.id).length;
            return (
              <Card key={r.id} onClick={() => selectRoute(r.id)} className="flex items-center gap-3">
                <span className="text-xl">{MODE_META[r.mode].emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px] text-white/50">{r.stops.length} stops · {count} vehicle{count === 1 ? '' : 's'}</div>
                </div>
                <span className="text-white/30">›</span>
              </Card>
            );
          })}
        </div>
      )}
      <Button className="mt-4 w-full" onClick={() => startBuild('road')}>+ New Route</Button>
      <div className="mt-2 text-center text-[11px] text-white/40">
        Fleet models available: {VEHICLE_MODELS.filter((m) => !m.tech || unlockedTech.includes(m.tech)).length}/{VEHICLE_MODELS.length}
        {' · '}{Object.keys(MODEL_BY_ID).length} total
      </div>
    </Sheet>
  );
}
