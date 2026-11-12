// Server-side sitemap fetcher used by /api/sitemap (Vercel) and the dev server.
// Browsers cannot read most sitemaps directly (CORS), so the tool asks this to fetch them.
import dns from 'node:dns/promises';
import net from 'node:net';
import zlib from 'node:zlib';

const MAX_BYTES = 30 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 15000;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) return isPrivateIp(v.slice(7));
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80');
}

async function assertPublic(u) {
  if (!/^https?:$/.test(u.protocol)) throw new HttpError(400, 'Only http and https URLs are supported.');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new HttpError(400, 'That address is not allowed.');
  }
  let addrs;
  if (net.isIP(host)) {
    addrs = [{ address: host }];
  } else {
    try {
      addrs = await dns.lookup(host, { all: true });
    } catch {
      throw new HttpError(502, 'Could not resolve ' + host + '.');
    }
  }
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) {
    throw new HttpError(400, 'That address is not allowed.');
  }
}

async function readLimited(res) {
  const chunks = [];
  let total = 0;
  for await (const chunk of res.body) {
    total += chunk.length;
    if (total > MAX_BYTES) throw new HttpError(413, 'That sitemap is larger than 30 MB.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** Returns { xml } or throws HttpError. */
export async function fetchSitemap(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new HttpError(400, 'That is not a valid URL.');
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublic(url);
    let res;
    try {
      res = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          'user-agent':
            'Mozilla/5.0 (compatible; SEOwithSivaSitemapExtractor/1.0; +https://www.seowithsiva.com/tools/sitemap-extractor/)',
          accept: 'application/xml,text/xml,application/gzip,*/*;q=0.8',
        },
      });
    } catch (e) {
      throw new HttpError(
        504,
        e && e.name === 'TimeoutError' ? 'The site took too long to respond.' : 'Could not reach ' + url.hostname + '.'
      );
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location'), url);
      continue;
    }
    if (!res.ok) {
      throw new HttpError(res.status === 404 ? 404 : 502, 'The site answered HTTP ' + res.status + ' for ' + url.href + '.');
    }

    let buf = await readLimited(res);
    if (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
      try {
        buf = zlib.gunzipSync(buf, { maxOutputLength: MAX_BYTES });
      } catch {
        throw new HttpError(422, 'Could not decompress that .gz sitemap.');
      }
    }
    const xml = buf.toString('utf8');
    if (!/<(urlset|sitemapindex)[\s>]/i.test(xml)) {
      throw new HttpError(422, url.href + ' did not return a sitemap (no urlset or sitemapindex found).');
    }
    return { xml };
  }
  throw new HttpError(502, 'Too many redirects.');
}

/** Shared request handler for Node-style (req, res). */
export async function handleSitemapRequest(req, res) {
  const send = (status, body, type) => {
    res.statusCode = status;
    res.setHeader('content-type', (type || 'application/json') + '; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.end(body);
  };
  try {
    const target = new URL(req.url, 'http://x').searchParams.get('url');
    if (!target) return send(400, JSON.stringify({ error: 'Missing url parameter.' }));
    const { xml } = await fetchSitemap(target);
    send(200, xml, 'application/xml');
  } catch (e) {
    send(e.status || 500, JSON.stringify({ error: e.message || 'Unexpected error.' }));
  }
}
