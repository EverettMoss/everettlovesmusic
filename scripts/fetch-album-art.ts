import fs from "fs";
import path from "path";

const REFETCH = process.argv.includes("--refetch");

// Strip punctuation/spaces for fuzzy comparison
function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function fetchAlbumArt(
  title: string,
  artist: string,
  searchQuery?: string
): Promise<{ url: string; matchedTitle: string; matchedArtist: string } | null> {
  const term = searchQuery ?? `${title} ${artist}`;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=musicTrack&limit=5`;
  const res = await fetch(url);
  const data = await res.json() as {
    results?: Array<{ trackName?: string; artistName?: string; artworkUrl100?: string }>;
  };
  const results = data.results ?? [];
  if (results.length === 0) return null;

  const titleN = norm(title);
  const artistN = norm(artist);

  // Score each result: exact title = 3, partial title = 1, exact artist = 2, partial artist = 1
  const scored = results.map((r) => {
    const rTitle = norm(r.trackName ?? "");
    const rArtist = norm(r.artistName ?? "");
    let score = 0;
    if (rTitle === titleN) score += 3;
    else if (rTitle.includes(titleN) || titleN.includes(rTitle)) score += 1;
    if (rArtist === artistN) score += 2;
    else if (rArtist.includes(artistN) || artistN.includes(rArtist)) score += 1;
    return { r, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].r;
  if (!best.artworkUrl100) return null;

  return {
    url: best.artworkUrl100.replace("100x100bb", "600x600bb"),
    matchedTitle: best.trackName ?? "",
    matchedArtist: best.artistName ?? "",
  };
}

async function main() {
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));

  let updated = 0;

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const post = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (post.type !== "songs") continue;

    let changed = false;
    for (const song of post.songs) {
      if (song.albumArtUrl && !REFETCH) continue;

      const result = await fetchAlbumArt(song.title, song.artist, song.searchQuery);
      if (result) {
        const titleMatch = norm(result.matchedTitle) === norm(song.title);
        const artistMatch = norm(result.matchedArtist) === norm(song.artist);
        const warning = !titleMatch || !artistMatch ? " ⚠ check match" : "";
        console.log(`  ✓ ${song.title} — ${song.artist}`);
        console.log(`    → "${result.matchedTitle}" by ${result.matchedArtist}${warning}`);
        song.albumArtUrl = result.url;
        changed = true;
      } else {
        console.log(`  ✗ no result: ${song.title} — ${song.artist}`);
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2) + "\n");
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated} post file(s).`);
}

main().catch(console.error);
