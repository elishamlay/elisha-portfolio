"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BANDS, fmt, runDemo } from "./demo";
import { Cmd } from "./views";

const padR = (s: string, n: number) => s.padEnd(n, " ");
const padL = (s: string, n: number) => s.padStart(n, " ");

function Stage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="demo-stage">
      <div className="hl demo-title">{title}</div>
      {children}
    </div>
  );
}

export function DemoRun({ seed }: { seed: number }) {
  const r = useMemo(() => runDemo(seed), [seed]);
  const rootRef = useRef<HTMLDivElement>(null);

  const stages = useMemo<ReactNode[]>(() => {
    const first = r.txs.slice(0, 6);
    const missed = r.mismatches.length - r.caughtByZ;
    const falsePos = r.flagged.length - r.caughtByZ;

    return [
      <p key="intro" className="dim">
        Sample data generated in your browser (seed {seed}). The tariff is
        illustrative, not any bank&apos;s real one. This mirrors how I approach
        charge verification: classify, reconcile, then look for outliers.
      </p>,

      <Stage key="s1" title="1/4  Extract">
        <p>
          Loaded {r.txs.length} transactions worth TZS {fmt(r.totalValue)}.
        </p>
      </Stage>,

      <Stage key="s2" title="2/4  Classify against the tariff matrix">
        <pre className="demo">
          {BANDS.map(
            (b) => `${padR(b.label, 19)} fee TZS ${padL(fmt(b.fee), 5)}\n`,
          ).join("")}
          {"\n"}
          {`${padR("id", 8)}${padL("amount", 9)}  ${padR("band", 19)}${padL("fee", 6)}\n`}
          {first
            .map(
              (t) =>
                `${padR(t.id, 8)}${padL(fmt(t.amount), 9)}  ${padR(t.band.label, 19)}${padL(fmt(t.expected), 6)}`,
            )
            .join("\n")}
          {`\n... ${r.txs.length - first.length} more classified`}
        </pre>
      </Stage>,

      <Stage key="s3" title="3/4  Reconcile charged fee against expected fee">
        <pre className="demo">
          {`${padR("id", 8)}${padL("expected", 9)}${padL("charged", 9)}${padL("diff", 7)}  issue\n`}
          {r.mismatches
            .map(
              (t) =>
                `${padR(t.id, 8)}${padL(fmt(t.expected), 9)}${padL(fmt(t.charged), 9)}${padL(
                  (t.diff > 0 ? "+" : "") + fmt(t.diff),
                  7,
                )}  ${t.issue}`,
            )
            .join("\n")}
        </pre>
        <p>
          <span className="err">{r.mismatches.length} mismatches.</span>{" "}
          Revenue lost to undercharging: TZS {fmt(r.undercharged)}. Customers
          overcharged: TZS {fmt(r.overcharged)}.
        </p>
      </Stage>,

      <Stage key="s4" title={`4/4  Z-score on fee variance (flag at |z| >= ${r.threshold})`}>
        <p className="dim">
          mean {r.mean.toFixed(1)} · standard deviation {r.sd.toFixed(1)}
        </p>
        {r.flagged.length ? (
          <pre className="demo">
            {`${padR("id", 8)}${padL("diff", 7)}${padL("z", 8)}  issue\n`}
            {r.flagged
              .map(
                (t) =>
                  `${padR(t.id, 8)}${padL((t.diff > 0 ? "+" : "") + fmt(t.diff), 7)}${padL(
                    t.z.toFixed(2),
                    8,
                  )}  ${t.issue ?? "none, false alarm"}`,
              )
              .join("\n")}
          </pre>
        ) : (
          <p className="dim">Nothing crossed the threshold on this seed.</p>
        )}
      </Stage>,

      <Stage key="s5" title="Result">
        <p>
          Reconciliation found all {r.mismatches.length} exact mismatches. The
          Z-score flagged {r.caughtByZ} of them
          {falsePos > 0 ? ` and raised ${falsePos} false alarm${falsePos > 1 ? "s" : ""}` : ""}.
          {missed > 0
            ? ` It missed ${missed} because that variance was small next to the larger ones.`
            : ""}
        </p>
        <p className="dim">
          That is why both exist: reconciliation catches known tariff errors,
          the Z-score surfaces patterns nobody wrote a rule for. Try another
          sample with <Cmd cmd={`demo ${seed + 1}`} /> or see the real build in{" "}
          <Cmd cmd="open ra-pipeline" />.
        </p>
      </Stage>,
    ];
  }, [r, seed]);

  const [shown, setShown] = useState(1);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(stages.length);
      return;
    }
    if (shown >= stages.length) return;
    const id = window.setTimeout(() => setShown((s) => s + 1), 750);
    return () => window.clearTimeout(id);
  }, [shown, stages.length]);

  useEffect(() => {
    const screen = rootRef.current?.closest(".screen");
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [shown]);

  return <div ref={rootRef}>{stages.slice(0, shown)}</div>;
}
