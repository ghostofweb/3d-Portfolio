import Link from "next/link";
import type { Metadata } from "next";
import { API_URL } from "@/lib/api";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing from ${site.name} on backend systems, infrastructure, and building things.`,
};

interface BlogListItem {
  _id: string;
  slug: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  author?: { name?: string; username?: string };
}

interface BlogsResponse {
  success: boolean;
  data: {
    blogs: BlogListItem[];
    totalPages: number;
    currentPage: number;
    totalPosts: number;
  };
}

function excerptOf(html: string, length = 160) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

async function getBlogs(page: number): Promise<BlogsResponse["data"] | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/blogs?page=${page}&limit=9`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const json: BlogsResponse = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const data = await getBlogs(page);

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-20">
      <Link
        href="/"
        className="text-sm text-text-muted transition-colors hover:text-accent"
      >
        ← Back
      </Link>

      <h1 className="mt-6 font-serif text-3xl font-semibold text-text sm:text-4xl">
        Blog
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted">
        Notes on backend systems, infrastructure, and things I&apos;m building.
      </p>

      {!data && (
        <p className="mt-12 text-sm text-text-muted">
          Couldn&apos;t load posts right now. Check back soon.
        </p>
      )}

      {data && data.blogs.length === 0 && (
        <p className="mt-12 text-sm text-text-muted">
          No posts published yet — check back soon.
        </p>
      )}

      {data && data.blogs.length > 0 && (
        <div className="mt-10 flex flex-col divide-y divide-border">
          {data.blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="group flex flex-col gap-2 py-6 first:pt-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-base font-semibold text-text group-hover:text-accent">
                  {blog.title}
                </h2>
                <span className="text-xs text-text-muted">
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">
                {excerptOf(blog.content)}
              </p>
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between text-sm">
          <Link
            href={`/blog?page=${page - 1}`}
            aria-disabled={page <= 1}
            className={`text-text-muted transition-colors hover:text-accent ${
              page <= 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            ← Previous
          </Link>
          <span className="text-text-muted">
            Page {data.currentPage} of {data.totalPages}
          </span>
          <Link
            href={`/blog?page=${page + 1}`}
            aria-disabled={page >= data.totalPages}
            className={`text-text-muted transition-colors hover:text-accent ${
              page >= data.totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  );
}
