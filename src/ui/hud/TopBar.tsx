import { engine, useGame } from '../../game/useEngine';
import { netWorth } from '../../game/economy';
import { formatDate, formatClock, formatMoney } from '../../utils/format';
import { useUI } from '../../store/uiStore';
import type { SpeedKey } from '../../game/engine';

const SPEEDS: { key: SpeedKey; label: string }[] = [
  { key: 'pause', label: '❚❚' },
  { key: 'x1', label: '▶' },
  { key: 'x2', label: '▶▶' },
  { key: 'x3', label: '⏩' },
];

export default function TopBar() {
  const cash = useGame((s) => s.cash);
  const time = useGame((s) => s.time);
  const rp = useGame((s) => Math.floor(s.researchPoints));
  const speed = useGame(() => engine.speed);
  const nw = useGame((s) => netWorth(s));
  const openPanel = useUI((s) => s.openPanel);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-2"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}
    >
      {/* Money */}
      <div className="pointer-events-auto flex flex-col gap-1 rounded-2xl border border-white/10 bg-surface-900/80 px-3 py-2 shadow-glass backdrop-blur">
        <div className={`text-lg font-extrabold leading-none ${cash < 0 ? 'text-danger' : 'text-accent'}`}>
          {formatMoney(cash)}
        </div>
        <div className="text-[10px] font-medium text-white/50">Net worth {formatMoney(nw)}</div>
      </div>

      {/* Date + speed */}
      <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-surface-900/80 px-3 py-1.5 shadow-glass backdrop-blur">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-white/85">{formatDate(time)}</span>
          <span className="text-[11px] tabular-nums text-white/45">{formatClock(time)}</span>
        </div>
        <div className="flex items-center gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s.key}
              onClick={() => engine.setSpeed(s.key)}
              className={`h-7 min-w-[30px] rounded-lg px-1.5 text-[11px] font-bold transition ${
                speed === s.key ? 'bg-accent text-surface-950 shadow-glow' : 'bg-white/8 text-white/70 hover:bg-white/15'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Research + menu */}
      <div className="pointer-events-auto flex flex-col items-end gap-1">
        <button
          onClick={() => openPanel('research')}
          className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-surface-900/80 px-3 py-2 shadow-glass backdrop-blur"
        >
          <span className="text-sm">🔬</span>
          <span className="text-sm font-bold text-accent-soft">{rp}</span>
        </button>
        <button
          onClick={() => openPanel('menu')}
          className="rounded-2xl border border-white/10 bg-surface-900/80 px-3 py-1.5 text-sm shadow-glass backdrop-blur"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
