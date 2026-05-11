// Cloudflare Pages Function: handles POST /api/contact
// Verifies the reCAPTCHA token with Google, then sends an email via Resend.

interface Env {
  RECAPTCHA_SECRET_KEY: string;
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface Context {
  request: Request;
  env: Env;
}

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  captchaToken?: string;
}

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ success: false, message: 'Invalid request body.' }, 400);
  }

  const { name, email, message, captchaToken } = payload;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return jsonResponse({ success: false, message: 'Please fill in all fields.' }, 400);
  }

  if (!captchaToken) {
    return jsonResponse({ success: false, message: 'Captcha verification required.' }, 400);
  }

  // 1) Verify the reCAPTCHA token with Google
  let verifyData: RecaptchaResponse;
  try {
    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      }),
    });
    verifyData = await verifyResponse.json();
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return jsonResponse({ success: false, message: 'Captcha verification failed. Please try again.' }, 500);
  }

  if (!verifyData.success) {
    console.warn('reCAPTCHA rejected:', verifyData['error-codes']);
    return jsonResponse({ success: false, message: 'Captcha verification failed. Please try again.' }, 400);
  }

  // 2) Send the email via Resend
  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
        reply_to: email,
        subject: `New enquiry from ${name}`,
        html: `
          <h2 style="font-family: sans-serif; color: #1a1a1a;">New contact form submission</h2>
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
      return jsonResponse({ success: false, message: 'Failed to send message. Please try again.' }, 500);
    }
  } catch (err) {
    console.error('Email send error:', err);
    return jsonResponse({ success: false, message: 'Failed to send message. Please try again.' }, 500);
  }

  return jsonResponse({
    success: true,
    message: 'Thank you for your message. I will be in touch shortly.',
  });
}
