import fs from "fs";
import path from "path";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local");
  process.exit(1);
}

async function getToken(): Promise<string> {
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

async function fetchAlbumArt(token: string, query: string): Promise<string | null> {
  const url = `https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json() as { tracks?: { items?: Array<{ album?: { images?: Array<{ url: string }> } }> } };
  return data.tracks?.items?.[0]?.album?.images?.[0]?.url ?? null;
}

async function main() {
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));

  const token = await getToken();
  let updated = 0;

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const post = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (post.type !== "songs") continue;

    let changed = false;
    for (const song of post.songs) {
      if (song.albumArtUrl) continue;
      const artUrl = await fetchAlbumArt(token, song.spotifyQuery);
      if (artUrl) {
        song.albumArtUrl = artUrl;
        changed = true;
        console.log(`  ✓ ${song.title} — ${song.artist}`);
      } else {
        console.log(`  ✗ no art found: ${song.spotifyQuery}`);
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
