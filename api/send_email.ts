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
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  const SENDER_EMAIL = process.env.SENDER_EMAIL
  const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL

  if (!SENDER_EMAIL || !RECEIVER_EMAIL) {
    // Misconfigured sender/receiver — return an error so this can be diagnosed
    res.status(500).json({ ok: false, error: 'Missing SENDER_EMAIL or RECEIVER_EMAIL on server' })
    return
  }

  const subject = 'New AVNTAE contact inquiry'
  const textBody = `Name: ${name || '-'}\nEmail: ${email}\n\nMessage:\n${message}`

  // Prefer Resend when configured
  if (RESEND_API_KEY) {
    const payload = {
      from: SENDER_EMAIL,
      to: [RECEIVER_EMAIL],
      reply_to: email,
      subject,
      text: textBody,
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
        const text = await response.text().catch(() => '')
        res.status(502).json({ ok: false, error: `Resend error: ${response.status} ${text}` })
        return
      }

      res.status(200).json({ ok: true, sent: true })
      return
    } catch (error) {
      res.status(502).json({ ok: false, error: String(error) })
      return
    }
  }

  // Fallback to SendGrid if configured
  if (SENDGRID_API_KEY) {
    try {
      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: RECEIVER_EMAIL }] }],
          from: { email: SENDER_EMAIL },
          subject,
          content: [{ type: 'text/plain', value: textBody }],
        }),
      })

      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        res.status(502).json({ ok: false, error: `SendGrid error: ${resp.status} ${text}` })
        return
      }

      res.status(200).json({ ok: true, sent: true })
      return
    } catch (error) {
      res.status(502).json({ ok: false, error: String(error) })
      return
    }
  }

  // No provider configured
  res.status(500).json({ ok: false, error: 'No email provider configured (RESEND_API_KEY or SENDGRID_API_KEY required)' })
}
