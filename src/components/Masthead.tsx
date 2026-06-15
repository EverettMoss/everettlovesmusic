export default function Masthead() {
  return (
    <header style={{ textAlign: "center", padding: "84px 0 0" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 22 }}>
        <span style={{ width: 7, height: 7, background: "var(--accent)", borderRadius: 1, display: "block" }} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          My Music Journal
        </span>
      </div>
      <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1 }}>everettlovesmusic.blog</h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--text-muted)", margin: "20px auto 0", maxWidth: "44ch" }}>
        The home of all my music thoughts & reccomendations.
      </p>
    </header>
  );
}
