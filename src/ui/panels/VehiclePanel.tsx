import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { MODEL_BY_ID } from '../../data/vehicles';
import { CARGO_BY_ID } from '../../data/cargo';
import { formatMoney } from '../../utils/format';
import { sfx } from '../../game/audio';
import { Button, Chip, SectionTitle, Stat } from '../atoms';
import Sheet from '../Sheet';

function conditionColor(c: number): string {
  if (c > 66) return '#7ee081';
  if (c > 33) return '#ffcf5c';
  return '#ff5c7a';
}

export default function VehiclePanel() {
  const selectedVehicle = useUI((s) => s.selectedVehicle);
  const selectVehicle = useUI((s) => s.selectVehicle);
  const showToast = useUI((s) => s.showToast);
  useGame((s) => s.time); // live updates

  if (!selectedVehicle) return null;
  const v = engine.state.vehicles[selectedVehicle];
  if (!v) return null;
  const model = MODEL_BY_ID[v.modelId];
  const route = engine.state.routes[v.routeId];
  const cargo = Object.entries(v.cargo).filter(([, n]) => n > 0);
  const load = cargo.reduce((a, [, n]) => a + n, 0);
  const serviceCost = Math.round(model.price * 0.12 * (1 - v.condition / 100));

  const statusText = v.status === 'moving' ? 'En route' : v.status === 'loading' ? 'At station' : 'Broken down';
  const statusColor = v.status === 'moving' ? '#5ff0d4' : v.status === 'loading' ? '#ffcf5c' : '#ff5c7a';

  return (
    <Sheet title={v.name} emoji={model.emoji} onClose={() => selectVehicle(null)}>
      <div className="mb-3 flex items-center gap-2">
        <Chip color={statusColor}>{statusText}</Chip>
        <span className="text-xs text-white/50">{route?.name ?? 'Unassigned'}</span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <Stat label="Lifetime income" value={formatMoney(v.totalIncome)} accent="#38e8c6" />
        <Stat label="Age" value={`${Math.floor(v.age)} days`} />
        <Stat label="Capacity" value={`${load}/${model.capacity}`} sub={model.carries === 'pax' ? 'passengers' : 'freight'} />
        <Stat label="Speed" value={`${model.speed} km/h`} />
      </div>

      <SectionTitle>Condition</SectionTitle>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${v.condition}%`, background: conditionColor(v.condition) }} />
        </div>
        <span className="text-xs text-white/60">{Math.round(v.condition)}%</span>
      </div>

      <SectionTitle>Onboard cargo</SectionTitle>
      {cargo.length > 0 ? (
        <div className="mb-4 space-y-1">
          {cargo.map(([c, n]) => (
            <div key={c} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 text-sm">
              <span>{CARGO_BY_ID[c]?.emoji} {CARGO_BY_ID[c]?.name}</span>
              <span className="font-semibold text-white/70">{n}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 rounded-lg bg-white/5 px-3 py-2 text-center text-xs text-white/45">Empty — loading at next stop.</div>
      )}

      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="flex-1"
          disabled={serviceCost <= 0}
          onClick={() => { const r = engine.serviceVehicle(v.id); if (r.ok) sfx.coin(); showToast(r.ok ? 'Serviced to 100%.' : r.error ?? ''); }}
        >
          🔧 Service {serviceCost > 0 ? formatMoney(serviceCost) : ''}
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => { const r = engine.sellVehicle(v.id); if (r.ok) { sfx.click(); selectVehicle(null); } showToast(r.ok ? 'Vehicle sold.' : r.error ?? ''); }}
        >
          Sell
        </Button>
      </div>
    </Sheet>
  );
}
