import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    let filePath;

    if (pathname === '/' || pathname === '/index.html') {
      filePath = path.join(process.cwd(), 'public', 'index.html');
    } else if (pathname.endsWith('.css')) {
      filePath = path.join(process.cwd(), 'public', pathname);
    } else if (pathname.endsWith('.js')) {
      filePath = path.join(process.cwd(), 'public', pathname);
    } else {
      // Default to index.html for SPA routing
      filePath = path.join(process.cwd(), 'public', 'index.html');
    }

    const fileContents = await fs.readFile(filePath, 'utf8');

    // Set appropriate content type
    if (pathname.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (pathname.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else {
      res.setHeader('Content-Type', 'text/html');
    }

    res.status(200).send(fileContents);
  } catch (error) {
    console.error('Error serving static file:', error);
    res.status(404).json({ error: 'File not found' });
  }
}