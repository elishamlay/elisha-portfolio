// Sample-data engine behind the `demo` command.
// Everything here is generated in the browser from a seed. The tariff is
// illustrative and does not belong to any real bank.

export type Band = { label: string; max: number; fee: number };

export const BANDS: Band[] = [
  { label: "0 - 10,000", max: 10_000, fee: 100 },
  { label: "10,001 - 50,000", max: 50_000, fee: 350 },
  { label: "50,001 - 200,000", max: 200_000, fee: 800 },
  { label: "200,001 and above", max: Infinity, fee: 1_500 },
];

export type Issue = "undercharge" | "overcharge" | "wrong band" | null;

export type Tx = {
  id: string;
  amount: number;
  band: Band;
  expected: number;
  charged: number;
  diff: number;
  issue: Issue;
  z: number;
  flagged: boolean;
};

export type DemoResult = {
  seed: number;
  txs: Tx[];
  totalValue: number;
  mismatches: Tx[];
  undercharged: number;
  overcharged: number;
  mean: number;
  sd: number;
  threshold: number;
  flagged: Tx[];
  caughtByZ: number;
};

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const bandFor = (amount: number): Band =>
  BANDS.find((b) => amount <= b.max) ?? BANDS[BANDS.length - 1];

export function runDemo(seed: number, n = 40, threshold = 2): DemoResult {
  const rand = mulberry32(seed);

  // Amounts are spread on a log scale so every band shows up.
  const txs: Tx[] = Array.from({ length: n }, (_, i) => {
    const raw = Math.exp(Math.log(2_000) + rand() * (Math.log(600_000) - Math.log(2_000)));
    const amount = Math.round(raw / 500) * 500;
    const band = bandFor(amount);
    return {
      id: `TX${String(1001 + i)}`,
      amount,
      band,
      expected: band.fee,
      charged: band.fee,
      diff: 0,
      issue: null,
      z: 0,
      flagged: false,
    };
  });

  // Plant four known problems on transactions whose fee is at least 350.
  const eligible = txs.map((t, i) => (t.expected >= 350 ? i : -1)).filter((i) => i >= 0);
  const kinds: Issue[] = ["undercharge", "undercharge", "overcharge", "wrong band"];
  for (const kind of kinds) {
    if (!eligible.length) break;
    const pick = eligible.splice(Math.floor(rand() * eligible.length), 1)[0];
    const t = txs[pick];
    t.issue = kind;
    if (kind === "undercharge") t.charged = 0;
    else if (kind === "overcharge") t.charged = t.expected * 2;
    else t.charged = BANDS[0].fee; // billed at the lowest band
  }

  for (const t of txs) t.diff = t.charged - t.expected;

  const mean = txs.reduce((s, t) => s + t.diff, 0) / n;
  const variance = txs.reduce((s, t) => s + (t.diff - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  for (const t of txs) {
    t.z = sd === 0 ? 0 : (t.diff - mean) / sd;
    t.flagged = Math.abs(t.z) >= threshold;
  }

  const mismatches = txs.filter((t) => t.diff !== 0);
  const flagged = txs.filter((t) => t.flagged);

  return {
    seed,
    txs,
    totalValue: txs.reduce((s, t) => s + t.amount, 0),
    mismatches,
    undercharged: -mismatches.filter((t) => t.diff < 0).reduce((s, t) => s + t.diff, 0),
    overcharged: mismatches.filter((t) => t.diff > 0).reduce((s, t) => s + t.diff, 0),
    mean,
    sd,
    threshold,
    flagged,
    caughtByZ: mismatches.filter((t) => t.flagged).length,
  };
}

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
