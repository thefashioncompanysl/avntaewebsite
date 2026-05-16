import { serve } from 'std/server';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY') || process.env.SUPABASE_SERVICE_KEY;
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || process.env.SENDER_EMAIL;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase environment variables');
}
if (!SENDGRID_API_KEY || !SENDER_EMAIL) {
  console.warn('SendGrid not configured. This function will only mark jobs as error.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

async function sendEmail(recipient: string, subject: string, body: string) {
  if (!SENDGRID_API_KEY || !SENDER_EMAIL) throw new Error('SendGrid not configured');

  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: recipient }] }],
      from: { email: SENDER_EMAIL },
      subject,
      content: [{ type: 'text/plain', value: body }],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`SendGrid error: ${resp.status} ${text}`);
  }
}

serve(async (req) => {
  try {
    // fetch pending jobs
    const { data: jobs, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(10);

    if (error) throw error;

    for (const job of jobs || []) {
      try {
        await sendEmail(job.recipient, job.subject, job.body);
        await supabase.from('email_queue').update({ status: 'sent', processed_at: new Date().toISOString() }).eq('id', job.id);
      } catch (err) {
        await supabase.from('email_queue').update({ status: 'error', error: String(err), processed_at: new Date().toISOString() }).eq('id', job.id);
      }
    }

    return new Response(JSON.stringify({ processed: jobs?.length || 0 }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
