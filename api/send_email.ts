export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { name, email, message } = req.body || {}
  if (!email || !message) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  const SENDER_EMAIL = process.env.SENDER_EMAIL
  const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL

  if (!SENDGRID_API_KEY || !SENDER_EMAIL || !RECEIVER_EMAIL) {
    res.status(500).json({ error: 'Server not configured' })
    return
  }

  const payload = {
    personalizations: [
      {
        to: [{ email: RECEIVER_EMAIL }],
        subject: 'New AVNTAE contact inquiry',
      },
    ],
    from: { email: SENDER_EMAIL },
    reply_to: { email },
    content: [
      {
        type: 'text/plain',
        value: `Name: ${name || '-'}\nEmail: ${email}\n\nMessage:\n${message}`,
      },
    ],
  }

  try {
    const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const text = await r.text()
      res.status(502).json({ error: 'SendGrid error', detail: text })
      return
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Send error', detail: error?.message || 'Unknown error' })
  }
}

