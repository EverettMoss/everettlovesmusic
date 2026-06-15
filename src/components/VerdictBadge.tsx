import type { Verdict } from "@/lib/posts";

const VERDICTS: Record<Verdict, { label: string; color: string; bg: string }> = {
  soty:   { label: "Song of the year potential",    color: "oklch(0.6 0.13 75)",   bg: "oklch(0.95 0.045 82)" },
  love:   { label: "I love this + on repeat",       color: "oklch(0.54 0.13 158)", bg: "oklch(0.95 0.04 160)" },
  cool:   { label: "Cool but no reason to replay",  color: "oklch(0.54 0.1 232)",  bg: "oklch(0.95 0.03 232)" },
  ok:     { label: "OK",                            color: "oklch(0.5 0.012 250)", bg: "oklch(0.95 0.004 250)" },
  boring: { label: "Boring",                        color: "oklch(0.53 0.07 288)", bg: "oklch(0.95 0.025 288)" },
  meh:    { label: "Not my cup of tea",             color: "oklch(0.58 0.15 50)",  bg: "oklch(0.95 0.04 58)" },
  skip:   { label: "Save your ears",                color: "oklch(0.56 0.19 27)",  bg: "oklch(0.95 0.045 30)" },
};

interface Props {
  verdict: Verdict;
}

export default function VerdictBadge({ verdict }: Props) {
  const { label, color, bg } = VERDICTS[verdict];
  return (
    <span style={{
      display: "inline-block",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.01em",
      padding: "5px 11px",
      borderRadius: 6,
      whiteSpace: "nowrap",
      color,
      background: bg,
    }}>
      {label}
    </span>
  );
}

export { VERDICTS };
