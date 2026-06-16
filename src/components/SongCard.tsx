"use client";

import Image from "next/image";
import { useState } from "react";
import type { Song, LyricLine } from "@/lib/posts";
import VerdictBadge from "./VerdictBadge";
import ShareModal from "./ShareModal";

const LINK_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12.5,
  fontWeight: 500,
  color: "oklch(0.46 0.11 165)",
  textDecoration: "none",
  padding: "5px 11px",
  border: "1px solid oklch(0.89 0.012 40)",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

const BTN_STYLE: React.CSSProperties = {
  ...LINK_STYLE,
  background: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

function LyricBlock({ lines, caption }: { lines: LyricLine[]; caption?: string }) {
  return (
    <div style={{ margin: "18px 0 4px", paddingLeft: 18, borderLeft: "2px solid oklch(0.45 0.1 165)" }}>
      <div style={{ fontSize: 18, lineHeight: 1.62, fontWeight: 500, letterSpacing: "-0.012em", color: "oklch(0.3 0.008 60)" }}>
        {lines.map((line, i) =>
          line.highlight ? (
            <div key={i} style={{ display: "inline", background: "oklch(0.92 0.05 162)", borderRadius: 3, padding: "1px 2px" }}>
              {line.text}
            </div>
          ) : (
            <div key={i}>{line.text}</div>
          )
        )}
      </div>
      {caption && (
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", color: "oklch(0.46 0.11 165)", marginTop: 12 }}>
          — {caption}
        </div>
      )}
    </div>
  );
}

interface Props {
  song: Song;
  postMeta: { issue: number; date: string };
}

export default function SongCard({ song, postMeta }: Props) {
  const [showShare, setShowShare] = useState(false);
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  const spotifyUrl = `https://open.spotify.com/search/${query}`;
  const appleMusicUrl = `https://music.apple.com/us/search?term=${query}`;

  return (
    <>
      <article className="song-card">
        <div className="song-card-art" style={{ width: 82, height: 82, borderRadius: 7, overflow: "hidden", background: "oklch(0.88 0.005 70)" }}>
          {song.albumArtUrl ? (
            <Image src={song.albumArtUrl} alt={`${song.title} by ${song.artist}`} width={82} height={82} style={{ display: "block" }} />
          ) : (
            <div style={{ width: 82, height: 82 }} />
          )}
        </div>

        <div className="song-card-header">
          <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {song.title}
            <span style={{ margin: "0 5px", color: "oklch(0.82 0.004 70)" }}>·</span>
            <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>{song.artist}</span>
          </h3>
          <div style={{ marginTop: 11 }}>
            <VerdictBadge verdict={song.verdict} />
          </div>
        </div>

        <div className="song-card-body">
          <p style={{ fontSize: 15, lineHeight: 1.66, color: "var(--text-dim)", margin: "11px 0 0", maxWidth: "58ch" }}>
            {song.review}
          </p>

          {song.lyrics?.map((l, i) => <LyricBlock key={i} lines={l.lines} caption={l.caption} />)}

          {song.reviewPost && (
            <p style={{ fontSize: 15, lineHeight: 1.66, color: "var(--text-dim)", margin: "14px 0 0", maxWidth: "58ch" }}>
              {song.reviewPost}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 13 }}>
            <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Spotify <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
            <a href={appleMusicUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Apple Music <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
            <button onClick={() => setShowShare(true)} style={BTN_STYLE}>
              Share
            </button>
          </div>
        </div>
      </article>

      {showShare && (
        <ShareModal song={song} postMeta={postMeta} onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
