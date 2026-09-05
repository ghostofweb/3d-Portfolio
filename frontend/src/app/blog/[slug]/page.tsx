import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { API_URL } from "@/lib/api";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  author?: { name?: string; username?: string };
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/blog/${slug}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

function excerptOf(html: string, length = 160) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Post not found" };

  const description = excerptOf(blog.content);
  return {
    title: blog.title,
    description,
    openGraph: {
      title: blog.title,
      description,
      type: "article",
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const safeContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-20">
      <Link
        href="/blog"
        className="text-sm text-text-muted transition-colors hover:text-accent"
      >
        ← Back to blog
      </Link>

      <article className="mt-6">
        {blog.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.coverImage}
            alt=""
            className="mb-8 w-full rounded-xl border border-border object-cover"
          />
        )}

        <h1 className="font-serif text-2xl font-semibold text-text sm:text-3xl">
          {blog.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
          {blog.author?.name && <span>{blog.author.name}</span>}
          <span>
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {blog.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="blog-content mt-10"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </article>
    </div>
  );
}
