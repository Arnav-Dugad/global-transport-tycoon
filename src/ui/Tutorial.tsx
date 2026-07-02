import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../store/uiStore';
import { Button } from './atoms';

const STEPS = [
  { icon: '🌍', title: 'Welcome, tycoon!', body: 'You start with cash and a loan. Your goal: connect the world and grow your net worth.' },
  { icon: '🛠️', title: 'Build a route', body: 'Tap Build, pick a mode (Road is ready), then tap 2+ glowing cities on the map to connect them. Confirm to build stations.' },
  { icon: '🚚', title: 'Add vehicles', body: 'Open the route and buy a vehicle. It automatically loads cargo a destination wants and ships it back and forth for profit.' },
  { icon: '📦', title: 'Supply & demand', body: 'Every city produces and demands different goods. Delivering what a city wants pays the most — spread routes to avoid flooding one market.' },
  { icon: '🔬', title: 'Grow your empire', body: 'Earn research points to unlock trains, planes and ships. Watch your finances, service vehicles, and become a Global Magnate!' },
];

export default function Tutorial() {
  const setShowTutorial = useUI((s) => s.setShowTutorial);
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-surface-900 p-6 text-center shadow-glass"
        >
          <div className="mb-3 text-5xl">{step.icon}</div>
          <h2 className="text-xl font-bold">{step.title}</h2>
          <p className="mt-2 text-sm text-white/60">{step.body}</p>

          <div className="mt-4 flex justify-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-5 bg-accent' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowTutorial(false)}>Skip</Button>
            <Button className="flex-1" onClick={() => (last ? setShowTutorial(false) : setI(i + 1))}>{last ? "Let's go!" : 'Next'}</Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
