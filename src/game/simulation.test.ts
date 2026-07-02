import { describe, it, expect } from 'vitest';
import { newGame } from './world';
import { advanceWorld, autoReplaceVehicles } from './simulation';
import { buildRoute, buyVehicle, takeLoan, repayLoan, research } from './actions';
import { transact, netWorth } from './economy';
import { creditContracts } from './contracts';
import { BALANCE } from './balance';
import type { Contract } from './types';

function run(state: ReturnType<typeof newGame>, gameMinutes: number, step = BALANCE.simStepMinutes) {
  const iters = Math.round(gameMinutes / step);
  for (let i = 0; i < iters; i++) advanceWorld(state, step);
}

describe('new game', () => {
  it('starts with difficulty-correct cash and only road unlocked', () => {
    const s = newGame('normal', 12345);
    expect(s.cash).toBe(BALANCE.difficulty.normal.startCash);
    expect(s.loan).toBe(BALANCE.difficulty.normal.startLoan);
    expect(s.unlockedModes).toEqual(['road']);
    expect(Object.keys(s.cities).length).toBeGreaterThan(50);
  });
});

describe('economy ledger', () => {
  it('transact moves cash and records to the ledger', () => {
    const s = newGame('normal', 1);
    const before = s.cash;
    transact(s, 'freight', 1000);
    transact(s, 'fuel', -250);
    expect(s.cash).toBe(before + 750);
    expect(s.ledgerToday.freight).toBe(1000);
    expect(s.ledgerToday.fuel).toBe(-250);
    expect(s.stats.totalIncome).toBe(1000);
    expect(s.stats.totalSpent).toBe(250);
  });

  it('loans add cash without changing net worth', () => {
    const s = newGame('normal', 2);
    const nw0 = netWorth(s);
    takeLoan(s, 100_000);
    expect(Math.round(netWorth(s))).toBe(Math.round(nw0));
    repayLoan(s, 50_000);
    expect(Math.round(netWorth(s))).toBe(Math.round(nw0));
  });
});

describe('production', () => {
  it('accumulates stock over time', () => {
    const s = newGame('normal', 3);
    run(s, 60 * 6); // 6 game hours
    const anyCity = Object.values(s.cities)[0];
    const totalStock = Object.values(anyCity.stock).reduce((a, b) => a + b, 0);
    expect(totalStock).toBeGreaterThan(0);
  });
});

describe('core loop earns money', () => {
  it('a road route with a vehicle generates freight income', () => {
    const s = newGame('easy', 42);
    // Pick two far-apart cities that exist.
    const build = buildRoute(s, 'road', ['nyc', 'chi']);
    expect(build.ok).toBe(true);
    const buy = buyVehicle(s, 'van', build.id!);
    expect(buy.ok).toBe(true);

    run(s, 60 * 24 * 10); // 10 game days
    expect(s.stats.totalTrips).toBeGreaterThan(0);
    expect(s.ledgerToday.freight + s.finance.reduce((a, f) => a + f.income, 0)).toBeGreaterThan(0);
    expect(s.stats.totalDelivered).toBeGreaterThan(0);
  });
});

describe('determinism', () => {
  it('same seed + same actions => identical state', () => {
    const build = (seed: number) => {
      const s = newGame('normal', seed);
      buildRoute(s, 'road', ['lon', 'par']);
      buyVehicle(s, 'van', 'r1');
      run(s, 60 * 24 * 30); // 30 game days
      return s;
    };
    const a = build(777);
    const b = build(777);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('different seeds diverge', () => {
    const build = (seed: number) => {
      const s = newGame('normal', seed);
      buildRoute(s, 'road', ['tyo', 'osa']);
      buyVehicle(s, 'van', 'r1');
      run(s, 60 * 24 * 40);
      return s;
    };
    const a = build(1);
    const b = build(2);
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });
});

describe('contracts', () => {
  it('completes and pays out when its cargo is delivered to the destination', () => {
    const s = newGame('easy', 99);
    const contract: Contract = {
      id: 'ctest', fromCity: 'nyc', toCity: 'chi', cargo: 'goods',
      amount: 100, reward: 50_000, rp: 20,
      deadline: s.time + 10_000, createdAt: s.time, progress: 0, status: 'active',
    };
    s.contracts.push(contract);
    const cash0 = s.cash;
    const rp0 = s.researchPoints;

    creditContracts(s, 'chi', 'goods', 60); // partial
    expect(contract.status).toBe('active');
    expect(contract.progress).toBe(60);

    creditContracts(s, 'chi', 'goods', 60); // completes
    expect(contract.status).toBe('done');
    expect(s.cash).toBe(cash0 + 50_000);
    expect(s.researchPoints).toBe(rp0 + 20);
  });

  it('does not credit the wrong city or cargo', () => {
    const s = newGame('easy', 7);
    const contract: Contract = {
      id: 'ctest2', fromCity: 'nyc', toCity: 'chi', cargo: 'goods',
      amount: 50, reward: 1000, rp: 1,
      deadline: s.time + 10_000, createdAt: s.time, progress: 0, status: 'active',
    };
    s.contracts.push(contract);
    creditContracts(s, 'lax', 'goods', 100); // wrong city
    creditContracts(s, 'chi', 'oil', 100); // wrong cargo
    expect(contract.progress).toBe(0);
    expect(contract.status).toBe('active');
  });
});

describe('auto-replace', () => {
  function setupWorn() {
    const s = newGame('easy', 3);
    buildRoute(s, 'road', ['nyc', 'chi']);
    buyVehicle(s, 'van', 'r1');
    const v = Object.values(s.vehicles)[0];
    v.condition = 10; // worn below threshold
    v.age = 40;
    return { s, v };
  }

  it('renews a worn vehicle when enabled and affordable', () => {
    const { s, v } = setupWorn();
    s.autoReplace = true;
    const cash0 = s.cash;
    autoReplaceVehicles(s);
    expect(v.condition).toBe(100);
    expect(v.age).toBe(0);
    expect(s.cash).toBeLessThan(cash0); // charged the net cost
  });

  it('leaves the vehicle worn when disabled', () => {
    const { s, v } = setupWorn();
    s.autoReplace = false;
    autoReplaceVehicles(s);
    expect(v.condition).toBe(10);
  });

  it('leaves the vehicle worn when it cannot be afforded', () => {
    const { s, v } = setupWorn();
    s.autoReplace = true;
    s.cash = 0;
    autoReplaceVehicles(s);
    expect(v.condition).toBe(10);
  });

  it('keeps save determinism with auto-replace enabled', () => {
    const build = (seed: number) => {
      const s = newGame('normal', seed);
      s.autoReplace = true;
      buildRoute(s, 'road', ['lon', 'par']);
      buyVehicle(s, 'van', 'r1');
      const iters = Math.round((60 * 24 * 40) / BALANCE.simStepMinutes);
      for (let i = 0; i < iters; i++) advanceWorld(s, BALANCE.simStepMinutes);
      return s;
    };
    expect(JSON.stringify(build(555))).toBe(JSON.stringify(build(555)));
  });
});

describe('research gating', () => {
  it('cannot build rail before researching it', () => {
    const s = newGame('easy', 5);
    const r = buildRoute(s, 'rail', ['nyc', 'chi']);
    expect(r.ok).toBe(false);
  });

  it('unlocks rail after enough research points', () => {
    const s = newGame('easy', 5);
    s.researchPoints = 1000;
    expect(research(s, 'road2').ok).toBe(true);
    expect(research(s, 'rail').ok).toBe(true);
    expect(s.unlockedModes).toContain('rail');
    expect(buildRoute(s, 'rail', ['nyc', 'chi']).ok).toBe(true);
  });
});
