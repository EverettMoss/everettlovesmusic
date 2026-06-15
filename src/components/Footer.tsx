export default function Footer() {
  return (
    <footer style={{ textAlign: "center", marginTop: 96, paddingTop: 36, borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: 1, display: "block" }} />
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>everett loves music</span>
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "oklch(0.6 0.01 60)" }}>
        New posts all the time.&nbsp;&nbsp;©&nbsp;{new Date().getFullYear()}
      </p>
    </footer>
  );
}
