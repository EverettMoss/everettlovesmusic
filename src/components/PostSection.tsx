import type { Post } from "@/lib/posts";
import SongCard from "./SongCard";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function PostSection({ post }: { post: Post }) {
  const isNote = post.type === "note";

  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ width: 7, height: 7, background: "var(--accent)", borderRadius: 1, display: "block" }} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
          {formatDate(post.date)}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", color: "oklch(0.7 0.01 60)" }}>
          · Issue {post.issue}{isNote ? " · Note" : ""}
        </span>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.12, marginBottom: 14 }}>
        {post.title}
      </h2>

      {post.type === "songs" && (
        <>
          <p style={{ fontSize: 16.5, lineHeight: 1.72, color: "var(--text-secondary)", maxWidth: "62ch" }}>
            {post.intro}
          </p>
          <div style={{ marginTop: 28 }}>
            {post.songs.map((song, i) => (
              <SongCard key={i} song={song} />
            ))}
          </div>
        </>
      )}

      {post.type === "note" && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 26 }}>
          {post.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.78, color: "oklch(0.32 0.008 60)", maxWidth: "64ch", marginBottom: i < post.paragraphs.length - 1 ? 18 : 0 }}>
              {p}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
