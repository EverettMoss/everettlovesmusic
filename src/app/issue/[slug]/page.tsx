import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import PostSection from "@/components/PostSection";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: String(post.issue) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => String(p.issue) === slug);
  if (!post) return {};
  return {
    title: `Issue ${post.issue}: ${post.title} — Everett Loves Music`,
    description: post.type === "songs" ? post.intro[0] : post.type === "note" ? post.paragraphs[0] : post.type === "album" ? `${post.title} by ${post.artist}` : post.description,
  };
}

export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => String(p.issue) === slug);
  if (!post) notFound();

  return (
    <div style={{ fontFamily: "inherit", color: "var(--text)", background: "var(--bg)", minHeight: "100vh", padding: "0 24px 120px" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <Masthead />
        <div style={{ height: 1, background: "var(--border)", margin: "52px 0 0" }} />
        <PostSection post={post} />
        <Footer />
      </div>
    </div>
  );
}
