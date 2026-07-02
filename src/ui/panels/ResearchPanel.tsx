import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { TECH_TREE, TECH_BY_ID } from '../../data/tech';
import { Button, Card } from '../atoms';
import Sheet from '../Sheet';

export default function ResearchPanel() {
  const closePanel = useUI((s) => s.closePanel);
  const showToast = useUI((s) => s.showToast);
  const rp = useGame((s) => Math.floor(s.researchPoints));
  const unlocked = useGame((s) => s.unlockedTech);

  return (
    <Sheet title="Research" emoji="🔬" accent="#5ff0d4" onClose={closePanel}>
      <div className="mb-3 rounded-2xl bg-accent/10 px-3 py-2 text-center">
        <span className="text-2xl font-extrabold text-accent-soft">{rp}</span>
        <span className="ml-1 text-xs text-white/60">research points</span>
        <div className="mt-0.5 text-[11px] text-white/45">Earned from freight deliveries + passively over time.</div>
      </div>

      <div className="space-y-2">
        {TECH_TREE.map((t) => {
          const done = unlocked.includes(t.id);
          const missing = t.requires.filter((r) => !unlocked.includes(r));
          const locked = missing.length > 0;
          const affordable = rp >= t.cost;
          return (
            <Card key={t.id} className={done ? 'border-accent/40 bg-accent/5' : ''}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{t.name}</span>
                    {done && <span className="text-[10px] font-bold text-accent">✓ DONE</span>}
                  </div>
                  <div className="text-[11px] text-white/55">{t.description}</div>
                  {locked && (
                    <div className="mt-1 text-[10px] text-gold">Requires: {missing.map((m) => TECH_BY_ID[m]?.name).join(', ')}</div>
                  )}
                </div>
                {!done && (
                  <Button
                    variant={affordable && !locked ? 'primary' : 'ghost'}
                    disabled={locked || !affordable}
                    className="px-3 py-2 text-xs"
                    onClick={() => { const r = engine.research(t.id); showToast(r.ok ? `Unlocked ${t.name}!` : r.error ?? ''); }}
                  >
                    {t.cost} RP
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Sheet>
  );
}
