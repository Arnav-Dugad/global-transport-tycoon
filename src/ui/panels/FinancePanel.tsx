import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
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

  const [tab, setTab] = useState<'net' | 'flow'>('net');
  const chartData = finance.slice(-60).map((f) => ({ day: f.day, Net: Math.round(f.netWorth), In: Math.round(f.income), Out: Math.round(f.expenses) }));

  return (
    <Sheet title="Finance" emoji="📊" onClose={closePanel}>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <Stat label="Cash" value={formatMoney(cash)} accent={cash < 0 ? '#ff5c7a' : '#38e8c6'} />
        <Stat label="Net Worth" value={formatMoney(nw)} />
        <Stat label="Loan" value={formatMoney(loan)} sub={`${(rate * 100).toFixed(0)}% APR`} accent="#ffcf5c" />
        <Stat label="Fuel Price" value={`${fuel.toFixed(2)}×`} sub={fuel > 1.2 ? 'High' : fuel < 0.9 ? 'Low' : 'Normal'} />
      </div>

      <div className="mb-4 rounded-2xl bg-white/5 p-2">
        <div className="mb-1 flex gap-1">
          {(['net', 'flow'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-1 text-[11px] font-semibold transition ${tab === t ? 'bg-accent/20 text-accent-soft' : 'text-white/50 hover:bg-white/5'}`}
            >
              {t === 'net' ? 'Net Worth' : 'Cash Flow'}
            </button>
          ))}
        </div>
        <div className="h-44 w-full">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              {tab === 'net' ? (
                <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gttNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38e8c6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#38e8c6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: '#7d8ba3', fontSize: 10 }} tickMargin={6} minTickGap={24} />
                  <YAxis tick={{ fill: '#7d8ba3', fontSize: 10 }} tickFormatter={(v) => formatMoney(v)} width={58} />
                  <Tooltip
                    contentStyle={{ background: '#0f1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [formatMoney(v), 'Net worth']}
                    labelFormatter={(l) => `Day ${l}`}
                  />
                  <Area type="monotone" dataKey="Net" stroke="#38e8c6" strokeWidth={2} fill="url(#gttNet)" />
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: '#7d8ba3', fontSize: 10 }} tickMargin={6} minTickGap={24} />
                  <YAxis tick={{ fill: '#7d8ba3', fontSize: 10 }} tickFormatter={(v) => formatMoney(v)} width={58} />
                  <Tooltip
                    contentStyle={{ background: '#0f1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => formatMoney(v)}
                    labelFormatter={(l) => `Day ${l}`}
                  />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
                  <Line type="monotone" dataKey="In" stroke="#7ee081" strokeWidth={1.75} dot={false} name="Income" />
                  <Line type="monotone" dataKey="Out" stroke="#ff5c7a" strokeWidth={1.75} dot={false} name="Expenses" />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/40">Collecting data… let a few days pass.</div>
          )}
        </div>
      </div>

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
      <span className={`tabular-nums ${value >= 0 ? 'text-accent' : 'text-danger'}`}>{formatMoney(value)}</span>
    </div>
  );
}
