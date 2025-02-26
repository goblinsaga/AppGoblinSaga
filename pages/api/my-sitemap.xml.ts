import { NextApiRequest, NextApiResponse } from 'next';

const Sitemap = () => `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://mining.goblinsaga.xyz/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://app.goblinsaga.xyz/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://goblinsaga.xyz/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>
`.trim(); 

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/xml');
  res.write(Sitemap()); 
  res.end();
}
