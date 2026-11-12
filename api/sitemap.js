import { handleSitemapRequest } from '../src/utils/sitemapProxy.mjs';

export const config = { maxDuration: 30 };

export default function handler(req, res) {
  return handleSitemapRequest(req, res);
}
