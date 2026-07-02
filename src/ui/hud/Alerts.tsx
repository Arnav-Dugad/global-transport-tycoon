import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../../store/uiStore';
import { useGame } from '../../game/useEngine';
import { sfx } from '../../game/audio';
import type { GameEvent } from '../../game/types';

const KIND_STYLE: Record<GameEvent['kind'], string> = {
  breakdown: 'border-danger/40 bg-danger/15',
  weather: 'border-sky-400/30 bg-sky-500/10',
  fuel: 'border-gold/40 bg-gold/10',
  boom: 'border-accent/40 bg-accent/10',
  strike: 'border-danger/40 bg-danger/10',
  info: 'border-white/15 bg-white/8',
  achievement: 'border-gold/50 bg-gold/15',
};

export default function Alerts() {
  const toast = useUI((s) => s.toast);
  const latest = useGame((s) => s.events[0] as GameEvent | undefined);
  const lastId = useRef<string | null>(null);
  const [banner, setBanner] = useState<GameEvent | null>(null);

  useEffect(() => {
    if (latest && latest.id !== lastId.current) {
      lastId.current = latest.id;
      setBanner(latest);
      if (latest.kind === 'achievement') sfx.achievement();
      const t = window.setTimeout(() => setBanner((b) => (b?.id === latest.id ? null : b)), 4200);
      return () => window.clearTimeout(t);
    }
  }, [latest]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-40 flex flex-col items-center gap-2 px-3"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 84px)' }}
    >
      <AnimatePresence>
        {banner && (
          <motion.div
            key={banner.id}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            className={`w-full max-w-sm rounded-2xl border px-3 py-2 text-center shadow-glass backdrop-blur ${KIND_STYLE[banner.kind]}`}
          >
            <div className="text-xs font-bold">{banner.title}</div>
            <div className="text-[11px] text-white/70">{banner.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-full border border-white/15 bg-surface-800/95 px-4 py-2 text-xs font-semibold shadow-glass backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
