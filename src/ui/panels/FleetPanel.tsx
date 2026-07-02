import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { MODEL_BY_ID } from '../../data/vehicles';
import { formatMoney } from '../../utils/format';
import { Button, Card, EmptyState } from '../atoms';
import Sheet from '../Sheet';
import type { Vehicle } from '../../game/types';

const STATUS_LABEL: Record<Vehicle['status'], { text: string; color: string }> = {
  moving: { text: 'En route', color: '#5ff0d4' },
  loading: { text: 'At station', color: '#ffcf5c' },
  broken: { text: 'Broken down', color: '#ff5c7a' },
};

function conditionColor(c: number): string {
  if (c > 66) return '#7ee081';
  if (c > 33) return '#ffcf5c';
  return '#ff5c7a';
}

export default function FleetPanel() {
  const closePanel = useUI((s) => s.closePanel);
  const openPanel = useUI((s) => s.openPanel);
  const showToast = useUI((s) => s.showToast);
  const vehicles = useGame((s) => Object.values(s.vehicles));
  const routes = useGame((s) => s.routes);

  return (
    <Sheet title="Fleet" emoji="🚚" onClose={closePanel}>
      {vehicles.length === 0 ? (
        <EmptyState icon="🚐" title="No vehicles yet" hint="Open a route and add vehicles to start earning." />
      ) : (
        <div className="space-y-2">
          {vehicles.map((v) => {
            const model = MODEL_BY_ID[v.modelId];
            const route = routes[v.routeId];
            const st = STATUS_LABEL[v.status];
            const serviceCost = Math.round(model.price * 0.12 * (1 - v.condition / 100));
            return (
              <Card key={v.id}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{model.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{v.name}</div>
                    <div className="text-[11px] text-white/50">{route?.name ?? 'Unassigned'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: st.color }}>{st.text}</div>
                    <div className="text-[11px] text-accent">{formatMoney(v.totalIncome)}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${v.condition}%`, background: conditionColor(v.condition) }} />
                  </div>
                  <span className="text-[10px] text-white/45">{Math.round(v.condition)}%</span>
                  <Button
                    variant="ghost"
                    className="px-2 py-1 text-[11px]"
                    disabled={serviceCost <= 0}
                    onClick={() => { const r = engine.serviceVehicle(v.id); showToast(r.ok ? 'Serviced to 100%.' : r.error ?? ''); }}
                  >
                    🔧 {serviceCost > 0 ? formatMoney(serviceCost) : 'OK'}
                  </Button>
                  <Button
                    variant="danger"
                    className="px-2 py-1 text-[11px]"
                    onClick={() => { const r = engine.sellVehicle(v.id); showToast(r.ok ? 'Sold.' : r.error ?? ''); }}
                  >
                    Sell
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Button variant="ghost" className="mt-4 w-full" onClick={() => openPanel('routes')}>Manage routes to add vehicles →</Button>
    </Sheet>
  );
}
