"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Song } from "@/lib/posts";
import { VERDICTS } from "./VerdictBadge";

interface Props {
  song: Song;
  postMeta: { issue: number; date: string };
  onClose: () => void;
}

function proxyArt(url: string | null) {
  if (!url) return null;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function fmtShort(dateStr: string, issue: number) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })} · Issue ${issue}`;
}

function fmtLong(dateStr: string, issue: number) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })} · Issue ${issue}`;
}

const DL_BTN: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 13px", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
  color: "oklch(0.46 0.11 165)", background: "oklch(0.95 0.04 160)",
  border: "1px solid oklch(0.85 0.04 162)", borderRadius: 7, cursor: "pointer",
};

const DL_ALL: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "10px 18px", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
  color: "oklch(0.99 0.005 160)", background: "oklch(0.45 0.1 165)",
  border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap",
};

export default function ShareModal({ song, postMeta, onClose }: Props) {
  const sq1Ref = useRef<HTMLDivElement>(null);
  const sq2Ref = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const v = VERDICTS[song.verdict];
  const art = proxyArt(song.albumArtUrl);
  const d1 = fmtShort(postMeta.date, postMeta.issue);
  const d2 = fmtLong(postMeta.date, postMeta.issue);
  const FONT = { fontFamily: "'Schibsted Grotesk', sans-serif" };

  async function exportCard(
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
    w: number,
    h: number
  ) {
    if (!ref.current || busy) return;
    setBusy(true);
    try {
      const clone = ref.current.cloneNode(true) as HTMLDivElement;
      clone.style.transform = "none";
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:fixed;left:-99999px;top:0;";
      wrap.appendChild(clone);
      document.body.appendChild(wrap);
      const opts = { cacheBust: true, width: w, height: h, pixelRatio: 1 };
      await toPng(clone, opts);
      const url = await toPng(clone, opts);
      wrap.remove();
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setBusy(false);
    }
  }

  const slug = song.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  async function exportAll() {
    await exportCard(sq1Ref, `${slug}-feed.png`, 1080, 1080);
    await exportCard(sq2Ref, `${slug}-feed-band.png`, 1080, 1080);
    await exportCard(storyRef, `${slug}-story.png`, 1080, 1920);
  }

  // Lyric block shared between sq cards
  function LyricBlock({ fontSize = 36, borderWidth = 5, paddingLeft = 30, captionSize = 23, marginTop = 40 }: {
    fontSize?: number; borderWidth?: number; paddingLeft?: number; captionSize?: number; marginTop?: number;
  }) {
    if (!song.lyric) return null;
    return (
      <div style={{ marginTop, paddingLeft, borderLeft: `${borderWidth}px solid oklch(0.45 0.1 165)` }}>
        <div style={{ fontSize, lineHeight: 1.52, fontWeight: 600, letterSpacing: "-0.018em", color: "oklch(0.28 0.008 60)" }}>
          {song.lyric.lines.map((l, i) =>
            l.highlight ? (
              <div key={i} style={{ display: "inline", background: "oklch(0.92 0.05 162)", borderRadius: 5, padding: "2px 5px" }}>{l.text}</div>
            ) : (
              <div key={i}>{l.text}</div>
            )
          )}
        </div>
        {song.lyric.caption && (
          <div style={{ fontSize: captionSize, fontWeight: 600, letterSpacing: "0.01em", color: "oklch(0.46 0.11 165)", marginTop: 16 }}>
            — {song.lyric.caption}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, overflowY: "auto", padding: "40px 20px" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--bg)", borderRadius: 16, width: "100%", maxWidth: 540, margin: "0 auto", padding: "32px 28px 48px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Share</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>
              {song.title}{" "}
              <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>— {song.artist}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-muted)", padding: "4px 8px", lineHeight: 1, marginLeft: 12 }}>✕</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <button onClick={exportAll} disabled={busy} style={DL_ALL}>↓ Download all</button>
          {busy && <span style={{ fontSize: 13, fontWeight: 600, color: "oklch(0.46 0.11 165)" }}>Rendering…</span>}
        </div>

        {/* ── CARD 1: Feed 1080×1080 warm ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: "var(--text-muted)" }}>Feed post · 1080 × 1080</span>
            <button onClick={() => exportCard(sq1Ref, `${slug}-feed.png`, 1080, 1080)} disabled={busy} style={DL_BTN}>↓ PNG</button>
          </div>
          <div style={{ width: 480, height: 480, borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 12px 40px -16px oklch(0.3 0.02 60 / 0.3)" }}>
            <div ref={sq1Ref} style={{ width: 1080, height: 1080, transform: "scale(0.4444)", transformOrigin: "top left", background: "oklch(0.992 0.003 80)", position: "relative", ...FONT }}>
              <div style={{ position: "absolute", inset: 0, padding: 84, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                    <span style={{ width: 16, height: 16, background: "oklch(0.45 0.1 165)", borderRadius: 3, display: "block" }} />
                    <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.5 0.012 60)" }}>On Repeat</span>
                  </div>
                  <span style={{ fontSize: 23, fontWeight: 500, letterSpacing: "0.03em", color: "oklch(0.62 0.01 60)" }}>{d1}</span>
                </div>
                <div style={{ display: "flex", gap: 38, alignItems: "center", marginTop: 56 }}>
                  {art ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={art} alt="" style={{ width: 196, height: 196, borderRadius: 18, objectFit: "cover", flexShrink: 0, boxShadow: "0 24px 50px -20px oklch(0.3 0.02 60 / 0.45)" }} />
                  ) : (
                    <div style={{ width: 196, height: 196, borderRadius: 18, background: "oklch(0.88 0.005 70)", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "inline-block", fontSize: 22, fontWeight: 600, padding: "10px 20px", borderRadius: 11, color: v.color, background: v.bg }}>{v.label}</span>
                    <h2 style={{ fontSize: 58, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02, margin: "18px 0 0", color: "oklch(0.24 0.008 60)" }}>{song.title}</h2>
                    <div style={{ fontSize: 32, fontWeight: 400, color: "oklch(0.5 0.012 60)", marginTop: 6 }}>{song.artist}</div>
                  </div>
                </div>
                <p style={{ fontSize: 30, lineHeight: 1.5, color: "oklch(0.42 0.01 60)", margin: "52px 0 0" }}>{song.review}</p>
                <LyricBlock />
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 23, fontWeight: 500, color: "oklch(0.6 0.01 60)" }}>A weekly music journal</span>
                  <span style={{ fontSize: 23, fontWeight: 600, color: "oklch(0.46 0.11 165)" }}>everettlovesmusic.blog</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 2: Feed 1080×1080 green band ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: "var(--text-muted)" }}>Feed post · header band</span>
            <button onClick={() => exportCard(sq2Ref, `${slug}-feed-band.png`, 1080, 1080)} disabled={busy} style={DL_BTN}>↓ PNG</button>
          </div>
          <div style={{ width: 480, height: 480, borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 12px 40px -16px oklch(0.3 0.02 60 / 0.3)" }}>
            <div ref={sq2Ref} style={{ width: 1080, height: 1080, transform: "scale(0.4444)", transformOrigin: "top left", background: "oklch(0.992 0.003 80)", position: "relative", ...FONT }}>
              {/* Green header band */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 430, background: "oklch(0.45 0.1 165)", padding: "80px 84px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                    <span style={{ width: 16, height: 16, background: "oklch(0.97 0.02 160)", borderRadius: 3, display: "block" }} />
                    <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.92 0.03 160)" }}>On Repeat</span>
                  </div>
                  <span style={{ fontSize: 23, fontWeight: 500, letterSpacing: "0.03em", color: "oklch(0.85 0.05 162)" }}>{d1}</span>
                </div>
                <div style={{ display: "flex", gap: 34, alignItems: "center", marginTop: 46 }}>
                  {art ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={art} alt="" style={{ width: 184, height: 184, borderRadius: 16, objectFit: "cover", flexShrink: 0, boxShadow: "0 20px 44px -18px oklch(0.2 0.05 165 / 0.6)" }} />
                  ) : (
                    <div style={{ width: 184, height: 184, borderRadius: 16, background: "oklch(0.55 0.08 165)", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "inline-block", fontSize: 22, fontWeight: 600, padding: "10px 20px", borderRadius: 11, color: "oklch(0.46 0.11 165)", background: "oklch(0.97 0.02 160)" }}>{v.label}</span>
                    <h2 style={{ fontSize: 60, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, margin: "16px 0 0", color: "oklch(0.99 0.005 160)" }}>{song.title}</h2>
                    <div style={{ fontSize: 31, fontWeight: 400, color: "oklch(0.88 0.03 160)", marginTop: 6 }}>{song.artist}</div>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div style={{ position: "absolute", top: 430, left: 0, right: 0, bottom: 0, padding: "58px 84px 78px", display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 30, lineHeight: 1.5, color: "oklch(0.42 0.01 60)", margin: 0 }}>{song.review}</p>
                <LyricBlock marginTop={38} />
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 23, fontWeight: 500, color: "oklch(0.6 0.01 60)" }}>A weekly music journal</span>
                  <span style={{ fontSize: 23, fontWeight: 600, color: "oklch(0.46 0.11 165)" }}>everettlovesmusic.blog</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 3: Story 1080×1920 ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: "var(--text-muted)" }}>Story · 1080 × 1920</span>
            <button onClick={() => exportCard(storyRef, `${slug}-story.png`, 1080, 1920)} disabled={busy} style={DL_BTN}>↓ PNG</button>
          </div>
          <div style={{ width: 337, height: 600, borderRadius: 18, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 12px 40px -16px oklch(0.3 0.02 60 / 0.3)" }}>
            <div ref={storyRef} style={{ width: 1080, height: 1920, transform: "scale(0.3125)", transformOrigin: "top left", background: "oklch(0.992 0.003 80)", position: "relative", ...FONT }}>
              <div style={{ position: "absolute", inset: 0, padding: "130px 90px 116px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 16, height: 16, background: "oklch(0.45 0.1 165)", borderRadius: 3, display: "block" }} />
                  <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.5 0.012 60)" }}>On Repeat</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.03em", color: "oklch(0.62 0.01 60)", marginTop: 14 }}>{d2}</div>

                {art ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={art} alt="" style={{ width: 480, height: 480, borderRadius: 26, objectFit: "cover", marginTop: 74, boxShadow: "0 30px 60px -24px oklch(0.3 0.02 60 / 0.5)" }} />
                ) : (
                  <div style={{ width: 480, height: 480, borderRadius: 26, background: "oklch(0.88 0.005 70)", marginTop: 74 }} />
                )}

                <span style={{ display: "inline-block", fontSize: 28, fontWeight: 600, padding: "13px 26px", borderRadius: 13, color: v.color, background: v.bg, marginTop: 50 }}>{v.label}</span>
                <h2 style={{ fontSize: 78, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, margin: "24px 0 0", color: "oklch(0.24 0.008 60)" }}>{song.title}</h2>
                <div style={{ fontSize: 38, fontWeight: 400, color: "oklch(0.5 0.012 60)", marginTop: 10 }}>{song.artist}</div>

                <p style={{ fontSize: 33, lineHeight: 1.5, color: "oklch(0.42 0.01 60)", margin: "44px 0 0", maxWidth: "30ch" }}>{song.review}</p>

                {song.lyric && (
                  <div style={{ marginTop: 46 }}>
                    <div style={{ fontSize: 30, lineHeight: 1, color: "oklch(0.45 0.1 165)", marginBottom: 18 }}>♪</div>
                    <div style={{ fontSize: 40, lineHeight: 1.5, fontWeight: 600, letterSpacing: "-0.018em", color: "oklch(0.28 0.008 60)" }}>
                      {song.lyric.lines.map((l, i) =>
                        l.highlight ? (
                          <div key={i}><span style={{ background: "oklch(0.92 0.05 162)", borderRadius: 5, padding: "2px 8px" }}>{l.text}</span></div>
                        ) : (
                          <div key={i}>{l.text}</div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: "oklch(0.46 0.11 165)", letterSpacing: "0.02em" }}>Full issue · everettlovesmusic.blog</span>
                  <span style={{ fontSize: 22, fontWeight: 500, color: "oklch(0.62 0.01 60)" }}>A new issue every Sunday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
