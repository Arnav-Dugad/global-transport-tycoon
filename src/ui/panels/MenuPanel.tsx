import { useEffect, useState } from 'react';
import { useUI } from '../../store/uiStore';
import { engine, useGame } from '../../game/useEngine';
import { listSaves, loadGame, deleteSave, type SaveMeta } from '../../game/save';
import { ACHIEVEMENTS } from '../../game/achievements';
import { netWorth } from '../../game/economy';
import { companyTitle, formatMoney } from '../../utils/format';
import { Button, Card, SectionTitle, Toggle } from '../atoms';
import Sheet from '../Sheet';

export default function MenuPanel() {
  const closePanel = useUI((s) => s.closePanel);
  const setPhase = useUI((s) => s.setPhase);
  const showToast = useUI((s) => s.showToast);
  const settings = useUI((s) => s.settings);
  const setGraphics = useUI((s) => s.setGraphics);
  const toggleSound = useUI((s) => s.toggleSound);
  const unlocked = useGame((s) => s.achievements.map((a) => a.id));
  const company = useGame((s) => s.companyName);
  const nw = useGame((s) => netWorth(s));
  const autoReplace = useGame((s) => s.autoReplace);
  const title = companyTitle(nw);

  const [saves, setSaves] = useState<SaveMeta[]>([]);
  const refresh = () => { void listSaves().then(setSaves); };
  useEffect(refresh, []);

  const doSave = async () => {
    await engine.saveNow(`manual-${Date.now()}`);
    showToast('Game saved.');
    refresh();
  };
  const doLoad = async (slot: string) => {
    const s = await loadGame(slot);
    if (s) { engine.loadState(s); engine.setSpeed('x1'); showToast('Save loaded.'); closePanel(); }
  };

  return (
    <Sheet title="Menu" emoji="☰" onClose={closePanel}>
      <div className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-r from-accent/10 to-transparent p-3">
        <div className="text-lg font-bold">{company}</div>
        <div className="text-xs text-white/60">{title.emoji} {title.name} · {formatMoney(nw)} net worth</div>
      </div>

      <SectionTitle>Graphics</SectionTitle>
      <div className="mb-3 flex gap-2">
        <Button variant={settings.graphics === 'high' ? 'primary' : 'ghost'} className="flex-1 text-xs" onClick={() => { setGraphics('high'); showToast('Reload to apply 3D buildings.'); }}>High (3D)</Button>
        <Button variant={settings.graphics === 'low' ? 'primary' : 'ghost'} className="flex-1 text-xs" onClick={() => { setGraphics('low'); showToast('Reload to apply.'); }}>Low (fast)</Button>
      </div>
      <div className="mb-3 flex gap-2">
        <Button variant="ghost" className="flex-1 text-xs" onClick={toggleSound}>Sound: {settings.sound ? 'On' : 'Off'}</Button>
      </div>
      <div className="mb-4 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
        <span className="text-sm">♻️ Auto-replace worn vehicles</span>
        <Toggle on={autoReplace} onChange={(v) => engine.setAutoReplace(v)} />
      </div>

      <SectionTitle>Save & load</SectionTitle>
      <Button className="mb-2 w-full" onClick={doSave}>💾 Save game</Button>
      <div className="mb-4 space-y-1.5">
        {saves.length === 0 && <div className="text-center text-xs text-white/40">No saves yet.</div>}
        {saves.map((s) => (
          <Card key={s.slot} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-sm font-semibold">{s.slot.startsWith('auto') ? '⏱️ Autosave' : '💾 Manual'}</div>
              <div className="text-[11px] text-white/50">{formatMoney(s.netWorth)} · {s.routes} routes · {s.vehicles} vehicles</div>
            </div>
            <Button variant="ghost" className="px-2 py-1 text-[11px]" onClick={() => doLoad(s.slot)}>Load</Button>
            <button onClick={() => { void deleteSave(s.slot).then(refresh); }} className="text-white/40 hover:text-danger">🗑️</button>
          </Card>
        ))}
      </div>

      <SectionTitle>Achievements ({unlocked.length}/{ACHIEVEMENTS.length})</SectionTitle>
      <div className="mb-4 grid grid-cols-2 gap-1.5">
        {ACHIEVEMENTS.map((a) => {
          const has = unlocked.includes(a.id);
          return (
            <div key={a.id} className={`rounded-xl border px-2 py-2 text-center ${has ? 'border-accent/40 bg-accent/10' : 'border-white/8 bg-white/3 opacity-50'}`}>
              <div className="text-xl">{has ? a.emoji : '🔒'}</div>
              <div className="text-[10px] font-semibold">{a.name}</div>
            </div>
          );
        })}
      </div>

      <Button variant="danger" className="w-full" onClick={() => { engine.setSpeed('pause'); engine.active = false; setPhase('start'); closePanel(); }}>
        Quit to main menu
      </Button>
      <div className="mt-3 text-center text-[10px] text-white/30">Global Transport Tycoon · Free & open · Map data © OpenStreetMap contributors</div>
      <div className="mt-1 text-center text-[10px] font-semibold text-white/35">Arnav © {new Date().getFullYear()}</div>
    </Sheet>
  );
}
