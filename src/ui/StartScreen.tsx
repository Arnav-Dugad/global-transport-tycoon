import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../store/uiStore';
import { engine } from '../game/useEngine';
import { AUTOSAVE_SLOT, listSaves, loadGame, type SaveMeta } from '../game/save';
import { BALANCE, type Difficulty } from '../game/balance';
import { formatMoney } from '../utils/format';
import { Button } from './atoms';

const DIFFS: { id: Difficulty; name: string; blurb: string }[] = [
  { id: 'easy', name: 'Relaxed', blurb: 'More cash, cheap loans, calm world.' },
  { id: 'normal', name: 'Standard', blurb: 'A balanced tycoon challenge.' },
  { id: 'hard', name: 'Tycoon', blurb: 'Tight money, costly debt, frequent events.' },
];

const NAME_IDEAS = ['Ancora Logistics', 'Meridian Freight', 'Vanguard Cargo', 'Aurora Transit', 'Zenith Lines', 'Continental Haul'];

export default function StartScreen() {
  const setPhase = useUI((s) => s.setPhase);
  const setShowTutorial = useUI((s) => s.setShowTutorial);
  const [diff, setDiff] = useState<Difficulty>('normal');
  const [name, setName] = useState(() => NAME_IDEAS[Math.floor(Math.random() * NAME_IDEAS.length)]);
  const [saves, setSaves] = useState<SaveMeta[]>([]);

  useEffect(() => { void listSaves().then(setSaves); }, []);
  const auto = saves.find((s) => s.slot === AUTOSAVE_SLOT) ?? saves[0];

  const newGame = () => {
    engine.startGame(diff, undefined, name);
    setPhase('playing');
    setShowTutorial(true);
  };
  const cont = async () => {
    if (!auto) return;
    const s = await loadGame(auto.slot);
    if (s) { engine.loadState(s); engine.setSpeed('x1'); setPhase('playing'); }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950 px-6 py-10 text-center">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-2 text-6xl">🌍</div>
        <h1 className="bg-gradient-to-r from-accent-soft to-gold bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
          Global Transport Tycoon
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/55">
          Build a worldwide logistics empire on a real 3D map. Trucks, trains, planes and ships — connect real cities, master supply & demand, and grow your fortune.
        </p>
      </motion.div>

      <div className="mt-8 w-full max-w-sm">
        <div className="mb-2 text-left text-xs font-semibold uppercase tracking-wider text-white/40">Company name</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 28))}
          placeholder="Your company"
          className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white outline-none focus:border-accent/60"
        />
        <div className="mb-2 text-left text-xs font-semibold uppercase tracking-wider text-white/40">Choose difficulty</div>
        <div className="space-y-2">
          {DIFFS.map((d) => {
            const cfg = BALANCE.difficulty[d.id];
            const active = diff === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDiff(d.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${active ? 'border-accent bg-accent/15 shadow-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{d.name}</span>
                  <span className="text-xs text-gold">{formatMoney(cfg.startCash)} start</span>
                </div>
                <div className="text-[11px] text-white/50">{d.blurb}</div>
              </button>
            );
          })}
        </div>

        <Button className="mt-4 w-full py-3 text-base" onClick={newGame}>▶ New Game</Button>
        {auto && (
          <Button variant="ghost" className="mt-2 w-full" onClick={cont}>
            ⏱️ Continue · {formatMoney(auto.netWorth)}
          </Button>
        )}
      </div>

      <div className="mt-8 max-w-sm text-[11px] text-white/30">
        100% free, no ads, no account. Map data © OpenStreetMap contributors · Tiles by OpenFreeMap.
      </div>
      <div className="mt-2 text-[11px] font-semibold text-white/40">Arnav © {new Date().getFullYear()}</div>
    </div>
  );
}
