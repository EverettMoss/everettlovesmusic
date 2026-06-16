import fs from "fs";
import path from "path";

export type Verdict = "soty" | "love" | "rotation" | "cool" | "ok" | "boring" | "meh" | "skip";

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
}

export interface SongPost {
  issue: number;
  date: string;
  title: string;
  intro: string;
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

export type Post = SongPost | NotePost;

export function getAllPosts(): Post[] {
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(postsDir, f), "utf-8");
    return JSON.parse(raw) as Post;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
