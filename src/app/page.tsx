import { getAllPosts } from "@/lib/posts";
import Masthead from "@/components/Masthead";
import VerdictScale from "@/components/VerdictScale";
import PostSection from "@/components/PostSection";
import Footer from "@/components/Footer";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div style={{ fontFamily: "inherit", color: "var(--text)", background: "var(--bg)", minHeight: "100vh", padding: "0 24px 120px" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <Masthead />
        <div style={{ height: 1, background: "var(--border)", margin: "52px 0 0" }} />
        <VerdictScale />
        {posts.map((post) => (
          <PostSection key={post.issue} post={post} />
        ))}
        <Footer />
      </div>
    </div>
  );
}
