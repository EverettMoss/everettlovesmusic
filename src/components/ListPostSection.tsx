import Image from "next/image";
import Link from "next/link";
import type { ListPost } from "@/lib/posts";
import ListShareButton from "./ListShareButton";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const LINK_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 12,
  fontWeight: 500,
  color: "oklch(0.46 0.11 165)",
  textDecoration: "none",
  padding: "4px 10px",
  border: "1px solid oklch(0.89 0.012 40)",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

export default function ListPostSection({ post }: { post: ListPost }) {
  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ width: 7, height: 7, background: "var(--accent)", borderRadius: 1, display: "block" }} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
          {formatDate(post.date)}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", color: "oklch(0.7 0.01 60)" }}>
          · Issue {post.issue} · List
        </span>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.12, marginBottom: 14 }}>
        <Link href={`/issue/${post.issue}`} style={{ color: "inherit", textDecoration: "none" }}>
          {post.title}
        </Link>
      </h2>

      {post.description && (
        <p style={{ fontSize: 16.5, lineHeight: 1.72, color: "var(--text-secondary)", maxWidth: "62ch", marginBottom: 14 }}>
          {post.description}
        </p>
      )}

      <div style={{ marginBottom: 20 }}>
        <ListShareButton post={post} />
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        {post.songs.map((song, i) => {
          const query = encodeURIComponent(song.searchQuery ?? `${song.title} ${song.artist}`);
          const spotifyUrl = `https://open.spotify.com/search/${query}`;
          const appleMusicUrl = song.appleMusicUrl ?? `https://music.apple.com/us/search?term=${query}`;

          return (
            <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
              {/* Top row: number + art + title/artist */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "oklch(0.72 0.008 60)", width: 22, textAlign: "right", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ width: 52, height: 52, borderRadius: 6, overflow: "hidden", background: "oklch(0.88 0.005 70)", flexShrink: 0 }}>
                  {song.albumArtUrl ? (
                    <Image src={song.albumArtUrl} alt={`${song.title} by ${song.artist}`} width={52} height={52} style={{ display: "block" }} />
                  ) : (
                    <div style={{ width: 52, height: 52 }} />
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                    {song.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                    {song.artist}
                  </div>
                </div>
              </div>

              {/* Bottom row: share links, indented to align with title */}
              <div style={{ paddingLeft: 22 + 16 + 52 + 16, marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
                  Spotify <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
                </a>
                <a href={appleMusicUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
                  Apple Music <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
                </a>
                {song.youtubeUrl && (
                  <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
                    YouTube <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
                  </a>
                )}
                {song.soundcloudUrl && (
                  <a href={song.soundcloudUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
                    SoundCloud <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
