import fs from "fs";
import path from "path";

export type Verdict = "soty" | "love" | "rotation" | "cool" | "ok" | "boring" | "meh" | "skip";
export type AlbumVerdict = "amazing" | "aoty" | "solid" | "fans_only" | "boring" | "forgettable" | "gems";

export interface LyricLine {
  text: string;
  highlight?: boolean;
}

export interface Lyric {
  lines: LyricLine[];
  caption?: string;
}

export interface Song {
  title: string;
  artist: string;
  verdict: Verdict;
  review: string;
  reviewPost?: string;
  lyrics?: Lyric[];
  searchQuery?: string;
  albumArtUrl: string | null;
  appleMusicUrl?: string | null;
}

export interface SongPost {
  issue: number;
  date: string;
  title: string;
  intro: string[];
  type: "songs";
  songs: Song[];
}

export interface NotePost {
  issue: number;
  date: string;
  title: string;
  type: "note";
  paragraphs: string[];
}

export interface StandoutTrack {
  trackNumber?: number;
  title: string;
  verdict: Verdict;
  verdictLabel?: string;
  review: string;
}

export interface AlbumPost {
  issue: number;
  date: string;
  title: string;
  type: "album";
  artist: string;
  albumArtUrl: string | null;
  verdict: Verdict;
  verdictLabel?: string;
  albumVerdict: AlbumVerdict;
  ratingVerdict?: string;
  released?: string;
  label?: string;
  runtime?: string;
  tracks?: number;
  intro: string[];
  paragraphs?: string[];
  pullQuote?: string;
  standoutTracks?: StandoutTrack[];
  searchQuery?: string;
}

export type Post = SongPost | NotePost | AlbumPost;

export function getAllPosts(): Post[] {
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(postsDir, f), "utf-8");
    return JSON.parse(raw) as Post;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
