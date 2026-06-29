import Image from "next/image";
import type { AlbumPost } from "@/lib/posts";
import { VERDICTS, ALBUM_VERDICTS } from "./VerdictBadge";
import { renderInline } from "@/lib/renderInline";

const LINK_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12.5,
  fontWeight: 500,
  color: "oklch(0.46 0.11 165)",
  textDecoration: "none",
  padding: "6px 13px",
  border: "1px solid oklch(0.89 0.012 40)",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

interface MetaItemProps { label: string; value: string | number }
function MetaItem({ label, value }: MetaItemProps) {
  return (
    <span>
      <span style={{ color: "oklch(0.68 0.01 60)" }}>{label}</span>
      {" "}&nbsp;{value}
    </span>
  );
}

export default function AlbumPostSection({ post }: { post: AlbumPost }) {
  const v = VERDICTS[post.verdict];
  const badgeLabel = post.verdictLabel ?? v.label;
  const query = encodeURIComponent(`${post.title} ${post.artist}`);
  const spotifyUrl = `https://open.spotify.com/search/${query}`;
  const appleMusicUrl = `https://music.apple.com/us/search?term=${query}`;

  const metaItems = [
    post.released && { label: "Released", value: post.released },
    post.label    && { label: "Label",    value: post.label },
    post.runtime  && { label: "Runtime",  value: post.runtime },
    post.tracks   && { label: "Tracks",   value: post.tracks },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section style={{ paddingTop: 72 }}>

      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <span style={{ width: 7, height: 7, background: "var(--accent)", borderRadius: 1, display: "block" }} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
          {formatDate(post.date)}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", color: "oklch(0.7 0.01 60)" }}>
          · Issue {post.issue} · Album Review
        </span>
      </div>

      {/* Album hero */}
      <div className="album-hero">
        <div className="album-hero-art" style={{ background: "oklch(0.88 0.005 70)" }}>
          {post.albumArtUrl && (
            <Image
              src={post.albumArtUrl}
              alt={`${post.title} by ${post.artist}`}
              width={232}
              height={232}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: "oklch(0.56 0.012 60)" }}>
            {post.artist}
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.035em", margin: "6px 0 0", lineHeight: 0.98 }}>
            {post.title}
          </h2>
          <div style={{ marginTop: 16 }}>
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, letterSpacing: "0.01em", padding: "6px 12px", borderRadius: 6, color: v.color, background: v.bg }}>
              {badgeLabel}
            </span>
          </div>

          {metaItems.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px 14px", marginTop: 18, fontSize: 13, color: "oklch(0.5 0.012 60)" }}>
              {metaItems.map((item, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && <span style={{ color: "oklch(0.85 0.004 70)" }}>·</span>}
                  <MetaItem label={item.label} value={item.value} />
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
            <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Spotify <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
            <a href={appleMusicUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Apple Music <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Review */}
      <section style={{ marginTop: 44, borderTop: "1px solid var(--border)", paddingTop: 34 }}>
        {post.intro.map((p, i) => (
          <p key={i} style={{ fontSize: 19, lineHeight: 1.7, color: "oklch(0.3 0.008 60)", margin: i < post.intro.length - 1 ? "0 0 18px" : "0 0 20px", maxWidth: "64ch", fontWeight: 500 }}>
            {renderInline(p)}
          </p>
        ))}
        {post.paragraphs?.map((p, i) => (
          <p key={i} style={{ fontSize: 16.5, lineHeight: 1.78, color: "oklch(0.36 0.008 60)", margin: i < (post.paragraphs!.length - 1) ? "0 0 18px" : "0", maxWidth: "64ch" }}>
            {renderInline(p)}
          </p>
        ))}
      </section>

      {/* Pull quote */}
      {post.pullQuote && (
        <section style={{ marginTop: 36, paddingLeft: 22, borderLeft: "3px solid oklch(0.45 0.1 165)" }}>
          <p style={{ fontSize: 23, lineHeight: 1.42, fontWeight: 600, letterSpacing: "-0.018em", color: "oklch(0.28 0.008 60)", margin: 0, maxWidth: "50ch" }}>
            {renderInline(post.pullQuote)}
          </p>
        </section>
      )}

      {/* Standout tracks */}
      {post.standoutTracks && post.standoutTracks.length > 0 && (
        <section style={{ marginTop: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(0.6 0.01 60)" }}>
              Standout tracks
            </span>
            <span style={{ flex: 1, height: 1, background: "var(--border)", display: "block" }} />
          </div>
          {post.standoutTracks.map((track, i) => {
            const tv = VERDICTS[track.verdict];
            const trackBadgeLabel = track.verdictLabel ?? tv.label;
            return (
              <article key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "22px 0", borderTop: "1px solid var(--border)", marginTop: i === 0 ? 16 : 0 }}>
                {track.trackNumber != null && (
                  <span style={{ flexShrink: 0, width: 30, fontSize: 15, fontWeight: 700, color: "oklch(0.78 0.008 70)", letterSpacing: "-0.01em", paddingTop: 1 }}>
                    {String(track.trackNumber).padStart(2, "0")}
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>{track.title}</h3>
                    <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, color: tv.color, background: tv.bg, flexShrink: 0 }}>
                      {trackBadgeLabel}
                    </span>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.66, color: "oklch(0.45 0.01 60)", margin: "9px 0 0", maxWidth: "60ch" }}>
                    {renderInline(track.review)}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Verdict bar */}
      {(() => {
        const av = ALBUM_VERDICTS[post.albumVerdict];
        return (
          <section style={{ marginTop: 44, background: av.bg, border: `1px solid ${av.color}22`, borderRadius: 12, padding: "22px 26px", display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: av.color, flexShrink: 0 }}>
              {av.label}
            </span>
            {post.ratingVerdict && (
              <>
                <div style={{ width: 1, alignSelf: "stretch", minHeight: 20, background: `${av.color}44` }} />
                <p style={{ fontSize: 15.5, lineHeight: 1.62, color: "oklch(0.34 0.012 60)", margin: 0 }}>
                  <strong style={{ fontWeight: 700, color: "oklch(0.28 0.008 60)" }}>The verdict.</strong>{" "}
                  {renderInline(post.ratingVerdict)}
                </p>
              </>
            )}
          </section>
        );
      })()}

    </section>
  );
}
