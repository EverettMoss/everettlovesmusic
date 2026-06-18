"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import type { SongPost } from "@/lib/posts";
import { VERDICTS } from "./VerdictBadge";

interface Props {
  post: SongPost;
  onClose: () => void;
}

function proxyArt(url: string | null) {
  if (!url) return null;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function fmtDate(dateStr: string, issue: number) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })} · Issue ${issue}`;
}

const DL_BTN: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 13px", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
  color: "oklch(0.46 0.11 165)", background: "oklch(0.95 0.04 160)",
  border: "1px solid oklch(0.85 0.04 162)", borderRadius: 7, cursor: "pointer",
};

export default function PostShareModal({ post, onClose }: Props) {
  const storyRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewW, setPreviewW] = useState(300);

  useEffect(() => {
    if (modalRef.current) {
      setPreviewW(Math.min(480, modalRef.current.clientWidth - 32));
    }
  }, []);

  const storyW = Math.min(337, Math.round(previewW * 0.65));
  const storyH = Math.round(storyW * 1920 / 1080);
  const storyScale = storyW / 1080;

  const FONT = { fontFamily: "'Schibsted Grotesk', sans-serif" };
  const dateStr = fmtDate(post.date, post.issue);
  const slug = `issue-${post.issue}`;

  async function exportStory() {
    if (!storyRef.current || busy) return;
    setBusy(true);
    try {
      const clone = storyRef.current.cloneNode(true) as HTMLDivElement;
      clone.style.transform = "none";
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:fixed;left:-99999px;top:0;";
      wrap.appendChild(clone);
      document.body.appendChild(wrap);
      const opts = { cacheBust: true, width: 1080, height: 1920, pixelRatio: 1 };
      await toPng(clone, opts);
      const url = await toPng(clone, opts);
      wrap.remove();
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-post-story.png`;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, overflowY: "auto", padding: "16px 12px" }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{ background: "var(--bg)", borderRadius: 16, width: "100%", maxWidth: 540, margin: "0 auto", padding: "24px 16px 36px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Share post</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>{post.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-muted)", padding: "4px 8px", lineHeight: 1, marginLeft: 12 }}>✕</button>
        </div>

        {/* Story card */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: "var(--text-muted)", flexShrink: 1, minWidth: 0 }}>Full post story · 1080 × 1920</span>
            <button onClick={exportStory} disabled={busy} style={DL_BTN}>
              {busy ? "Rendering…" : "↓ PNG"}
            </button>
          </div>
          <div style={{ width: storyW, height: storyH, borderRadius: 18, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 12px 40px -16px oklch(0.3 0.02 60 / 0.3)" }}>
            <div
              ref={storyRef}
              style={{ width: 1080, height: 1920, transform: `scale(${storyScale})`, transformOrigin: "top left", background: "oklch(0.992 0.003 80)", position: "relative", ...FONT }}
            >
              <div style={{ position: "absolute", inset: 0, padding: "104px 88px", display: "flex", flexDirection: "column" }}>

                {/* Brand header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                    <span style={{ width: 16, height: 16, background: "oklch(0.45 0.1 165)", borderRadius: 3, display: "block" }} />
                    <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.5 0.012 60)" }}>On Repeat</span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 500, color: "oklch(0.62 0.01 60)" }}>{dateStr}</span>
                </div>

                {/* Post title */}
                <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.06, marginTop: 44, color: "oklch(0.22 0.008 60)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {post.title}
                </div>

                {/* Intro */}
                <div style={{ fontSize: 28, lineHeight: 1.52, color: "oklch(0.5 0.01 60)", marginTop: 18, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {post.intro}
                </div>

                {/* Divider */}
                <div style={{ height: 2, background: "oklch(0.91 0.004 70)", margin: "40px 0 34px" }} />

                {/* Song list */}
                <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {post.songs.map((song, i) => {
                    const v = VERDICTS[song.verdict];
                    const art = proxyArt(song.albumArtUrl);
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 26,
                          alignItems: "center",
                          padding: "16px 0",
                          borderTop: i > 0 ? "1px solid oklch(0.91 0.004 70)" : "none",
                          flexShrink: 0,
                        }}
                      >
                        {art ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={art} alt="" style={{ width: 100, height: 100, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 100, height: 100, borderRadius: 10, background: "oklch(0.88 0.005 70)", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "inline-block", fontSize: 18, fontWeight: 600, padding: "5px 13px", borderRadius: 8, color: v.color, background: v.bg }}>
                            {v.label}
                          </span>
                          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "oklch(0.22 0.008 60)", marginTop: 8, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                            {song.title}
                          </div>
                          <div style={{ fontSize: 27, fontWeight: 400, color: "oklch(0.52 0.012 60)", marginTop: 4 }}>
                            {song.artist}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
                  <span style={{ fontSize: 22, fontWeight: 500, color: "oklch(0.6 0.01 60)" }}>A weekly music journal</span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: "oklch(0.46 0.11 165)" }}>everettlovesmusic.blog</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
