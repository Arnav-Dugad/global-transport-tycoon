import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger' | 'gold';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-surface-950 hover:bg-accent-soft active:scale-95 shadow-glow',
  ghost: 'bg-white/5 text-white hover:bg-white/10 active:scale-95 border border-white/10',
  danger: 'bg-danger/90 text-white hover:bg-danger active:scale-95',
  gold: 'bg-gold text-surface-950 hover:brightness-110 active:scale-95',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium text-white/80"
      style={color ? { color, background: `${color}22` } : undefined}
    >
      {children}
    </span>
  );
}

export function Stat({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: ReactNode; accent?: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-white/45">{label}</div>
      <div className="text-lg font-bold leading-tight" style={accent ? { color: accent } : undefined}>{value}</div>
      {sub != null && <div className="text-[11px] text-white/50">{sub}</div>}
    </div>
  );
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-surface-800/70 p-3 ${onClick ? 'cursor-pointer active:scale-[0.99] transition' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/45">{children}</h3>;
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-2 text-4xl opacity-70">{icon}</div>
      <div className="text-sm font-semibold text-white/80">{title}</div>
      {hint && <div className="mt-1 max-w-xs text-xs text-white/45">{hint}</div>}
    </div>
  );
}
