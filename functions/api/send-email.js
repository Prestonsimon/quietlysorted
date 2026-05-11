export async function onRequestPost(context) {
  const { env, request } = context;
  const body = await request.json(); // Assumes your form sends JSON

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Contact Form <onboarding@resend.dev>", // Change to a verified email later
      to: "prestonsimon@mac.com", // Where you want to receive the mail
      subject: "New Website Inquiry",
      html: `<p><strong>Message:</strong> ${body.message}</p>`,
    }),
  });

  return new Response(JSON.stringify({ success: res.ok }), {
    headers: { "Content-Type": "application/json" },
  });
}