import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load .env.local first (preferred for secrets), then .env as fallback.
dotenv.config({ path: '.env.local' });
dotenv.config();

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Contact form endpoint (mirrors functions/api/contact.ts for local dev)
  app.post('/api/contact', async (req, res) => {
    const { name, email, message, captchaToken } = req.body ?? {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    if (!captchaToken) {
      return res.status(400).json({ success: false, message: 'Captcha verification required.' });
    }

    // 1) Verify reCAPTCHA with Google
    try {
      const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
          response: captchaToken,
        }),
      });
      const verifyData: { success: boolean; 'error-codes'?: string[] } = await verifyResponse.json();
      if (!verifyData.success) {
        console.warn('reCAPTCHA rejected:', verifyData['error-codes']);
        return res.status(400).json({ success: false, message: 'Captcha verification failed. Please try again.' });
      }
    } catch (err) {
      console.error('reCAPTCHA verification error:', err);
      return res.status(500).json({ success: false, message: 'Captcha verification failed. Please try again.' });
    }

    // 2) Send email via Resend (skipped locally if RESEND_API_KEY isn't set)
    if (!process.env.RESEND_API_KEY) {
      console.log('[dev] RESEND_API_KEY not set — logging submission instead of sending:', { name, email, message });
      return res.json({ success: true, message: 'Thank you for your message. I will be in touch shortly.' });
    }

    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,
          to: process.env.CONTACT_TO_EMAIL,
          reply_to: email,
          subject: `New enquiry from ${name}`,
          html: `
            <h2 style="font-family: sans-serif;">New contact form submission</h2>
            <p style="font-family: sans-serif;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="font-family: sans-serif;"><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p style="font-family: sans-serif;"><strong>Message:</strong></p>
            <p style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(message)}</p>
          `,
        }),
      });
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Resend API error:', emailResponse.status, errorText);
        return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }

    res.json({ success: true, message: 'Thank you for your message. I will be in touch shortly.' });
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
