import fs from "fs";
import path from "path";

async function fetchAlbumArt(query: string): Promise<string | null> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicTrack&limit=1`;
  const res = await fetch(url);
  const data = await res.json() as { results?: Array<{ artworkUrl100?: string }> };
  const artwork = data.results?.[0]?.artworkUrl100;
  if (!artwork) return null;
  return artwork.replace("100x100bb", "600x600bb");
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
      if (song.albumArtUrl) continue;
      const artUrl = await fetchAlbumArt(song.searchQuery);
      if (artUrl) {
        song.albumArtUrl = artUrl;
        changed = true;
        console.log(`  ✓ ${song.title} — ${song.artist}`);
      } else {
        console.log(`  ✗ no art found: ${song.searchQuery}`);
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
