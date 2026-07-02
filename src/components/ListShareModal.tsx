"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import type { ListPost } from "@/lib/posts";

interface Props {
  post: ListPost;
  onClose: () => void;
}

function FaviconIcon({ size = 44 }: { size?: number }) {
  const heartPath = "M220.346,136.508L139.314,217.539C133.105,223.737 122.899,223.737 116.689,217.539L33.58,134.43C22.326,123.185 15.996,107.913 15.996,92.004C15.996,74.976 23.248,58.729 35.924,47.359C59.205,26.344 97.174,28.305 120.502,51.656L128.002,59.148L137.58,49.57C149.255,38.009 165.138,31.67 181.564,32.016C198.046,32.396 213.652,39.604 224.627,51.906C245.611,75.203 243.689,113.156 220.346,136.508Z";
  const tf = { fontFamily: "'ArialRoundedMTBold', 'Arial Rounded MT Bold', sans-serif", fontSize: "200px" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      <g transform="matrix(1.703286,0,0,1.703286,-180.041203,-309.207539)">
        <g transform="matrix(0.515189,0,0,1,241.381189,155.963842)">
          <text x="128.889" y="151.696" style={tf}>m</text>
        </g>
        <g transform="matrix(0.397269,0,0,0.397269,249.645097,205.509158)">
          <path d={heartPath} fill="rgb(255,0,0)" stroke="rgb(255,0,0)" strokeWidth="1" />
        </g>
        <g transform="matrix(1.973295,0,0,1,-152.388352,156.159155)">
          <text x="128.889" y="151.696" style={{ ...tf, fill: "rgb(6,64,43)" }}>e</text>
        </g>
      </g>
      <g transform="matrix(-1.703286,0,0,1.703286,692.041203,-95.924563)">
        <g transform="matrix(0.515189,0,0,1,241.381189,155.963842)">
          <text x="128.889" y="151.696" style={{ ...tf, fill: "rgb(6,64,43)" }}>m</text>
        </g>
        <g transform="matrix(0.397269,0,0,0.397269,249.645097,205.509158)">
          <path d={heartPath} fill="rgb(255,0,0)" stroke="rgb(255,0,0)" strokeWidth="1" />
        </g>
        <g transform="matrix(1.973295,0,0,1,-152.388352,156.159155)">
          <text x="128.889" y="151.696" style={tf}>e</text>
        </g>
      </g>
    </svg>
  );
}

function proxyArt(url: string | null) {
  if (!url) return null;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function fmtDate(dateStr: string, issue: number) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })} · Issue ${issue}`;
}

async function fetchDataUrl(proxyUrl: string): Promise<string> {
  const res = await fetch(proxyUrl);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const DL_BTN: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 13px", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
  color: "oklch(0.46 0.11 165)", background: "oklch(0.95 0.04 160)",
  border: "1px solid oklch(0.85 0.04 162)", borderRadius: 7, cursor: "pointer",
};

export default function ListShareModal({ post, onClose }: Props) {
  const storyRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewW, setPreviewW] = useState(300);
  const [dataUrls, setDataUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modalRef.current) {
      setPreviewW(Math.min(480, modalRef.current.clientWidth - 32));
    }
  }, []);

  useEffect(() => {
    async function load() {
      const entries = await Promise.all(
        post.songs
          .map((s) => proxyArt(s.albumArtUrl))
          .filter((url): url is string => url !== null)
          .filter((url, i, arr) => arr.indexOf(url) === i)
          .map(async (url) => [url, await fetchDataUrl(url)] as const)
      );
      setDataUrls(Object.fromEntries(entries));
    }
    load().catch(() => {});
  }, [post]);

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
      const opts = { width: 1080, height: 1920, pixelRatio: 1 };
      await toPng(clone, opts);
      const url = await toPng(clone, opts);
      wrap.remove();
      const filename = `${slug}-list-story.png`;
      try {
        const blob = await fetch(url).then((r) => r.blob());
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      } catch {}
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
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Share list</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>{post.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-muted)", padding: "4px 8px", lineHeight: 1, marginLeft: 12 }}>✕</button>
        </div>

        {/* Story card */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: "var(--text-muted)" }}>Story · 1080 × 1920</span>
            <button onClick={exportStory} disabled={busy} style={DL_BTN}>
              {busy ? "Rendering…" : "↓ PNG"}
            </button>
          </div>
          <div style={{ width: storyW, height: storyH, borderRadius: 18, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 12px 40px -16px oklch(0.3 0.02 60 / 0.3)" }}>
            <div
              ref={storyRef}
              style={{ width: 1080, height: 1920, transform: `scale(${storyScale})`, transformOrigin: "top left", background: "oklch(0.992 0.003 80)", display: "flex", flexDirection: "column", ...FONT }}
            >
              {/* Header */}
              <div style={{ flexShrink: 0, padding: "68px 80px 26px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <span style={{ width: 14, height: 14, background: "oklch(0.45 0.1 165)", borderRadius: 3, display: "block" }} />
                  <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.5 0.012 60)" }}>Everett Loves Music</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 500, color: "oklch(0.62 0.01 60)", marginBottom: 12 }}>{dateStr}</div>
                <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04, color: "oklch(0.22 0.008 60)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {post.title}
                </div>
                {post.description && (
                  <div style={{ fontSize: 24, lineHeight: 1.45, color: "oklch(0.55 0.01 60)", marginTop: 12, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {post.description}
                  </div>
                )}
              </div>

              {/* Separator */}
              <div style={{ flexShrink: 0, height: 2, background: "oklch(0.91 0.004 70)", margin: "0 80px" }} />

              {/* Song rows — fixed height, top-to-bottom */}
              <div style={{ display: "flex", flexDirection: "column", padding: "0 80px" }}>
                {post.songs.map((song, i) => {
                  const art = proxyArt(song.albumArtUrl);
                  const artSrc = art ? (dataUrls[art] ?? art) : null;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 28,
                        alignItems: "center",
                        padding: "18px 0",
                        borderTop: i > 0 ? "1px solid oklch(0.91 0.004 70)" : "none",
                      }}
                    >
                      {/* Track number */}
                      <span style={{ fontSize: 22, fontWeight: 700, color: "oklch(0.48 0.11 165)", width: 36, textAlign: "right", flexShrink: 0, letterSpacing: "-0.02em" }}>
                        {i + 1}
                      </span>

                      {/* Album art */}
                      {artSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={artSrc} alt="" style={{ width: 108, height: 108, borderRadius: 10, objectFit: "cover", flexShrink: 0, boxShadow: "0 8px 20px oklch(0.3 0.02 60 / 0.18)" }} />
                      ) : (
                        <div style={{ width: 108, height: 108, borderRadius: 10, background: "oklch(0.88 0.005 70)", flexShrink: 0 }} />
                      )}

                      {/* Title + artist */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: "oklch(0.22 0.008 60)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                          {song.title}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 400, color: "oklch(0.52 0.012 60)", marginTop: 6 }}>
                          {song.artist}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{ flexShrink: 0, padding: "20px 80px 60px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: "oklch(0.46 0.11 165)" }}>everettlovesmusic.blog</span>
                <FaviconIcon size={60} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
