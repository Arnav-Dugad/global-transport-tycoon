import { useUI, type PanelId } from '../../store/uiStore';
import { useGame } from '../../game/useEngine';

const NAV: { id: PanelId; icon: string; label: string }[] = [
  { id: 'build', icon: '🛠️', label: 'Build' },
  { id: 'routes', icon: '🧭', label: 'Routes' },
  { id: 'fleet', icon: '🚚', label: 'Fleet' },
  { id: 'finance', icon: '📊', label: 'Finance' },
  { id: 'contracts', icon: '📋', label: 'Contracts' },
];

export default function BottomNav() {
  const panel = useUI((s) => s.panel);
  const openPanel = useUI((s) => s.openPanel);
  const closePanel = useUI((s) => s.closePanel);
  const startBuild = useUI((s) => s.startBuild);

  const vehicles = useGame((s) => Object.keys(s.vehicles).length);
  const routes = useGame((s) => Object.keys(s.routes).length);
  const contracts = useGame((s) => s.contracts.filter((c) => c.status === 'active').length);
  const badges: Partial<Record<string, number>> = { fleet: vehicles, routes, contracts };

  return (
    <div
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex justify-center px-2"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
    >
      <div className="flex w-full max-w-lg items-stretch justify-between gap-1 rounded-2xl border border-white/10 bg-surface-900/85 p-1.5 shadow-glass backdrop-blur">
        {NAV.map((n) => {
          const active = panel === n.id;
          const badge = badges[n.id as string];
          return (
            <button
              key={n.id}
              onClick={() => {
                if (n.id === 'build') { startBuild('road'); return; }
                if (active) closePanel();
                else openPanel(n.id);
              }}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition ${
                active ? 'bg-accent/20 text-accent-soft' : 'text-white/60 hover:bg-white/8'
              }`}
            >
              <span className="text-lg leading-none">{n.icon}</span>
              <span className="text-[10px] font-semibold">{n.label}</span>
              {badge != null && badge > 0 && (
                <span className="absolute right-1.5 top-1 rounded-full bg-accent px-1 text-[9px] font-bold text-surface-950">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
