/**
 * Serializes a JSON-LD object for safe embedding in a <script type="application/ld+json"> tag.
 *
 * Google Search Central (Aug 2026) changed their JSON-LD parser to standard JSON semantics:
 * it now applies only a single pass of HTML unescaping, so double-escaped entities like
 * &amp;amp; or &amp;#10004; are no longer unrolled. Structured data should rely on standard
 * JSON string escapes / Unicode hex escapes (&) instead of HTML entity encoding.
 *
 * This also guards against `&`, `<`, `>` characters in content (titles, excerpts, FAQ text,
 * etc.) being interpreted as HTML by any downstream processing, and prevents `</script>`
 * sequences in data from breaking out of the script tag.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
