export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { name, email, message } = req.body || {}
  if (!email || !message) {
    res.status(200).json({ ok: true, skipped: true })
    return
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const SENDER_EMAIL = process.env.SENDER_EMAIL
  const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL

  if (!RESEND_API_KEY || !SENDER_EMAIL || !RECEIVER_EMAIL) {
    res.status(200).json({ ok: true, skipped: true })
    return
  }

  const payload = {
    from: SENDER_EMAIL,
    to: [RECEIVER_EMAIL],
    reply_to: email,
    subject: 'New AVNTAE contact inquiry',
    text: `Name: ${name || '-'}\nEmail: ${email}\n\nMessage:\n${message}`,
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      res.status(200).json({ ok: true, sent: false })
      return
    }

    res.status(200).json({ ok: true, sent: true })
  } catch (error) {
    res.status(200).json({ ok: true, sent: false })
  }
}
