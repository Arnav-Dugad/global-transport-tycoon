import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Bottom sheet used for every panel. Full-width on phones, a floating card on
 * larger screens. Content scrolls; the header stays pinned.
 */
export default function Sheet({
  title,
  emoji,
  onClose,
  children,
  accent,
}: {
  title: string;
  emoji?: string;
  onClose: () => void;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0.6 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0.4 }}
      transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 mx-auto flex max-h-[74vh] w-full max-w-lg flex-col rounded-t-3xl border border-white/10 bg-surface-900/95 shadow-glass backdrop-blur-xl md:bottom-4 md:left-4 md:mx-0 md:max-h-[80vh] md:w-[380px] md:rounded-3xl"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)' }}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <div className="flex items-center gap-2">
          {emoji && <span className="text-xl">{emoji}</span>}
          <h2 className="text-base font-bold" style={accent ? { color: accent } : undefined}>{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70 hover:bg-white/15"
        >
          ✕
        </button>
      </div>
      <div className="gtt-scroll flex-1 overflow-y-auto px-4 pb-4">{children}</div>
    </motion.div>
  );
}
