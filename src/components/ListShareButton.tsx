"use client";

import { useState } from "react";
import type { ListPost } from "@/lib/posts";
import ListShareModal from "./ListShareModal";

export default function ListShareButton({ post }: { post: ListPost }) {
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
        Share list
      </button>
      {open && <ListShareModal post={post} onClose={() => setOpen(false)} />}
    </>
  );
}
