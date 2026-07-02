import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { netWorth } from '../../game/economy';
import { BALANCE } from '../../game/balance';
import { formatMoney } from '../../utils/format';
import { Button, SectionTitle, Stat } from '../atoms';
import Sheet from '../Sheet';

export default function FinancePanel() {
  const closePanel = useUI((s) => s.closePanel);
  const showToast = useUI((s) => s.showToast);
  const cash = useGame((s) => s.cash);
  const loan = useGame((s) => s.loan);
  const rate = useGame((s) => s.interestRate);
  const stats = useGame((s) => s.stats);
  const fuel = useGame((s) => s.fuelPrice);
  const finance = useGame((s) => s.finance);
  const nw = useGame((s) => netWorth(s));
  const today = useGame((s) => s.ledgerToday);

  const chartData = finance.slice(-60).map((f) => ({ day: f.day, Net: Math.round(f.netWorth), In: Math.round(f.income), Out: Math.round(f.expenses) }));

  return (
    <Sheet title="Finance" emoji="📊" onClose={closePanel}>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <Stat label="Cash" value={formatMoney(cash)} accent={cash < 0 ? '#ff5c7a' : '#38e8c6'} />
        <Stat label="Net Worth" value={formatMoney(nw)} />
        <Stat label="Loan" value={formatMoney(loan)} sub={`${(rate * 100).toFixed(0)}% APR`} accent="#ffcf5c" />
        <Stat label="Fuel Price" value={`${fuel.toFixed(2)}×`} sub={fuel > 1.2 ? 'High' : fuel < 0.9 ? 'Low' : 'Normal'} />
      </div>

      {chartData.length > 1 && (
        <div className="mb-4 rounded-2xl bg-white/5 p-2">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: '#7d8ba3', fontSize: 10 }} />
                <YAxis tick={{ fill: '#7d8ba3', fontSize: 10 }} tickFormatter={(v) => formatMoney(v)} width={54} />
                <Tooltip
                  contentStyle={{ background: '#0f1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatMoney(v)}
                  labelFormatter={(l) => `Day ${l}`}
                />
                <Line type="monotone" dataKey="Net" stroke="#38e8c6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="In" stroke="#7ee081" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Out" stroke="#ff5c7a" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <SectionTitle>Loans</SectionTitle>
      <div className="mb-4 flex gap-2">
        <Button variant="gold" className="flex-1 text-xs" onClick={() => { const r = engine.takeLoan(BALANCE.loanStep); showToast(r.ok ? `Borrowed ${formatMoney(BALANCE.loanStep)}.` : r.error ?? ''); }}>
          Borrow {formatMoney(BALANCE.loanStep)}
        </Button>
        <Button variant="ghost" className="flex-1 text-xs" onClick={() => { const r = engine.repayLoan(BALANCE.loanStep); showToast(r.ok ? `Repaid ${formatMoney(BALANCE.loanStep)}.` : r.error ?? ''); }}>
          Repay {formatMoney(BALANCE.loanStep)}
        </Button>
      </div>

      <SectionTitle>Today</SectionTitle>
      <div className="mb-4 space-y-1 rounded-2xl bg-white/5 p-3 text-sm">
        <Row label="📦 delivery income" value={today.freight} />
        <Row label="⛽ fuel" value={today.fuel} />
        <Row label="🔧 maintenance" value={today.maintenance} />
        <Row label="🏦 interest" value={today.interest} />
        <Row label="🛒 purchases" value={today.purchases} />
      </div>

      <SectionTitle>Lifetime stats</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Total income" value={formatMoney(stats.totalIncome)} />
        <Stat label="Total spent" value={formatMoney(stats.totalSpent)} />
        <Stat label="Cargo delivered" value={Math.round(stats.totalDelivered).toLocaleString('en-US')} />
        <Stat label="Trips completed" value={stats.totalTrips.toLocaleString('en-US')} />
      </div>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60">{label}</span>
      <span className={value >= 0 ? 'text-accent' : 'text-danger'}>{formatMoney(value)}</span>
    </div>
  );
}
