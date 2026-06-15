import VerdictBadge from "./VerdictBadge";
import type { Verdict } from "@/lib/posts";

const ALL_VERDICTS: Verdict[] = ["soty", "love", "cool", "ok", "boring", "meh", "skip"];

export default function VerdictScale() {
  return (
    <section style={{ paddingTop: 38, textAlign: "center" }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(0.6 0.01 60)", marginBottom: 16 }}>
        How I rate
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 620, margin: "0 auto" }}>
        {ALL_VERDICTS.map((v) => (
          <VerdictBadge key={v} verdict={v} />
        ))}
      </div>
    </section>
  );
}
