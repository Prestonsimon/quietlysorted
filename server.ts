import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    const { name, email, message, captchaToken } = req.body;
    console.log('Received contact form submission:', { name, email, message, hasCaptcha: !!captchaToken });
    
    if (!captchaToken) {
      return res.status(400).json({ success: false, message: 'Captcha verification required.' });
    }

    // In a real app, you would verify the captchaToken with Google's API:
    // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    // const verification = await fetch(verifyUrl, { method: 'POST' }).then(r => r.json());
    // if (!verification.success) return res.status(400).json({ success: false, message: 'Captcha verification failed.' });

    // In a real app, you would use nodemailer or an email service here.
    res.json({ 
      success: true, 
      message: 'Thank you for your message. We will be in touch shortly.' 
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    
    // Serve static assets with explicit MIME types and cache headers
    app.use(express.static(distPath, {
      index: false,
      immutable: true,
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));

    // Fallback for SPA: only serve index.html for navigation requests
    app.get('*', (req, res, next) => {
      // Don't serve index.html for requests that look like files (have extensions)
      // This prevents script/style 404s from returning HTML, which causes MIME errors
      if (req.url.includes('.') && !req.headers.accept?.includes('text/html')) {
        return next();
      }

      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Production build not found. Please run "npm run build".');
      }
    });

    // Final 404 handler for assets that weren't caught
    app.use((req, res) => {
      res.status(404).type('text/plain').send('Asset not found');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
