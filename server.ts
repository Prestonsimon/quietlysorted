import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

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

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
