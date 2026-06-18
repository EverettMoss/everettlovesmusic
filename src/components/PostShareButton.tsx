"use client";

import { useState } from "react";
import type { SongPost } from "@/lib/posts";
import PostShareModal from "./PostShareModal";

export default function PostShareButton({ post }: { post: SongPost }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "inherit",
          color: "oklch(0.46 0.11 165)",
          background: "none",
          border: "1px solid oklch(0.89 0.012 40)",
          borderRadius: 999,
          padding: "5px 12px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Share post
      </button>
      {open && <PostShareModal post={post} onClose={() => setOpen(false)} />}
    </>
  );
}
