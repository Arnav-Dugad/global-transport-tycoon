import { useUI } from '../../store/uiStore';
import { useGame } from '../../game/useEngine';
import { CITY_BY_ID } from '../../data/cities';
import { CARGO_BY_ID } from '../../data/cargo';
import { formatMoney } from '../../utils/format';
import { Card, EmptyState } from '../atoms';
import Sheet from '../Sheet';

export default function ContractsPanel() {
  const closePanel = useUI((s) => s.closePanel);
  const selectCity = useUI((s) => s.selectCity);
  const contracts = useGame((s) => s.contracts.filter((c) => c.status === 'active'));
  const time = useGame((s) => s.time);

  return (
    <Sheet title="Contracts" emoji="📋" accent="#ffcf5c" onClose={closePanel}>
      <p className="mb-3 text-[11px] text-white/50">
        Deliver the requested cargo to the destination city before the deadline for a bonus payout and research points.
        Any vehicle serving that city counts.
      </p>
      {contracts.length === 0 ? (
        <EmptyState icon="📭" title="No active contracts" hint="New contracts appear over time as your network grows." />
      ) : (
        <div className="space-y-2">
          {contracts.map((c) => {
            const def = CARGO_BY_ID[c.cargo];
            const daysLeft = Math.max(0, (c.deadline - time) / (24 * 60));
            const pct = Math.min(100, (c.progress / c.amount) * 100);
            const urgent = daysLeft < 5;
            return (
              <Card key={c.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {def?.emoji} Deliver {c.amount} {def?.name}
                    </div>
                    <div className="text-[11px] text-white/55">
                      <button className="underline decoration-white/20" onClick={() => selectCity(c.fromCity)}>{CITY_BY_ID[c.fromCity]?.name}</button>
                      {' → '}
                      <button className="underline decoration-white/20" onClick={() => selectCity(c.toCity)}>{CITY_BY_ID[c.toCity]?.name}</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gold">{formatMoney(c.reward)}</div>
                    <div className="text-[10px] text-accent-soft">+{c.rp} RP</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-white/50">{c.progress}/{c.amount}</span>
                  <span className={`text-[10px] font-semibold ${urgent ? 'text-danger' : 'text-white/50'}`}>{daysLeft.toFixed(0)}d left</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Sheet>
  );
}
