/**
 * The backend stores Cloudinary URLs as http://, which browsers block as
 * mixed content on this HTTPS-served site. Cloudinary serves the same
 * asset over https:// with no other change needed.
 */
export function toHttps(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace(/^http:\/\//i, "https://");
}

export function secureContentImages(html: string): string {
  return html.replace(/src="http:\/\//gi, 'src="https://');
}

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, (m) => HTML_ENTITIES[m]);
}

export function excerptOf(html: string, length = 160) {
  const text = decodeEntities(
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
  );
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
