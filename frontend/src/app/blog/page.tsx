import Link from "next/link";
import type { Metadata } from "next";
import { API_URL } from "@/lib/api";
import { site } from "@/content/site";
import { toHttps, excerptOf } from "@/lib/blog";

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

      <h1 className="mt-6 font-serif text-4xl font-semibold text-text sm:text-5xl">
        Blog
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-text">
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
        <div className="mt-10 flex flex-col gap-4">
          {data.blogs.map((blog) => {
            const cover = toHttps(blog.coverImage);
            return (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group flex gap-4 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md sm:gap-5 sm:p-5"
              >
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover sm:h-28 sm:w-28"
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="font-medium text-text group-hover:text-accent">
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
                          className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
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
