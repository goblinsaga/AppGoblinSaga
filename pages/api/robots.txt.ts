import { NextApiRequest, NextApiResponse } from 'next';

const Robots = () => `
  User-agent: *
  Allow: /
  Sitemap: https://app.goblinsaga.xyz/api/my-sitemap.xml
`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/plain');
  res.write(Robots());
  res.end();
}
