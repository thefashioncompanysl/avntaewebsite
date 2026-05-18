# Contact Us System - Setup & Deployment Guide

This guide sets up a complete contact form system using:
- **Frontend**: React contact form in `src/components/Contact.tsx`
- **Backend**: Supabase Edge Function `functions/send-contact`
- **Database**: Supabase `contacts` table
- **Email**: Resend API (or SendGrid fallback)
- **Hosting**: Vercel (frontend) + Supabase (Edge Function & database)

---

## Prerequisites

1. **Supabase Project** - [Create one](https://supabase.com)
2. **Resend Account** - [Sign up](https://resend.com) and get API key
3. **Vercel Project** - [Connect your GitHub repo](https://vercel.com)

---

## Step 1: Create the Contacts Table in Supabase

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project → **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the contents of `supabase-setup.sql` from this repository
4. Click **"Run"**

The table will be created with:
- `id` (auto-generated UUID)
- `name`, `email`, `message` (text fields)
- `created_at` (auto timestamp)
- Row-level security (public insert allowed)

### Option B: Using Supabase Web UI

1. Go to **Tables** → **Create a new table**
2. Name it `contacts`
3. Add columns:
   | Column | Type | Required | Default |
   |--------|------|----------|---------|
   | id | uuid | ✓ | gen_random_uuid() |
   | name | text | ✓ | - |
   | email | text | ✓ | - |
   | message | text | ✓ | - |
   | created_at | timestamp | ✓ | now() |
4. Enable RLS and add policy: `Allow public inserts`

---

## Step 2: Deploy Edge Function to Supabase

### Option A: Using Supabase CLI (Local)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link your project**
   ```bash
   supabase login
   supabase projects list
   supabase link --project-id YOUR_PROJECT_ID
   ```

3. **Deploy the function**
   ```bash
   supabase functions deploy send-contact
   ```

4. **Set secrets**
   ```bash
   supabase secrets set RESEND_API_KEY="your_key_here"
   supabase secrets set RECEIVER_EMAIL="avntae7@gmail.com"
   ```

### Option B: Using Supabase Web UI

1. Go to **Edge Functions** → **Create a new function**
2. Name it `send-contact`
3. Copy the code from `functions/send-contact/index.ts`
4. Paste into the editor and save
5. Go to **Settings** → **Edge Functions** and add secrets:
   - `RESEND_API_KEY`: Your Resend API key
   - `RECEIVER_EMAIL`: avntae7@gmail.com (or your email)

---

## Step 3: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up / log in
3. Go to **API Keys** section
4. Copy your API key (starts with `re_`)
5. Save it for the next step

---

## Step 4: Configure Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add the following variables for **Production** and **Preview**:
   
   | Variable | Value | Example |
   |----------|-------|---------|
   | `RESEND_API_KEY` | Your Resend API key | `re_abc123...` |
   | `RECEIVER_EMAIL` | Email to receive contact forms | `avntae7@gmail.com` |
   | `SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key (optional, for local testing) | `eyJ...` |

4. **Redeploy** your project (Vercel will auto-redeploy or click "Redeploy")

---

## Step 5: Get Supabase Credentials (for Edge Function)

These are automatically available in the Edge Function environment, but you may need them for local testing:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy:
   - `Project URL` → Store as `SUPABASE_URL`
   - `service_role` key → Store as `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
3. Copy `anon` key for the frontend (usually already in your `.env.local`)

---

## Step 6: Test the Contact Form

1. **Deploy your changes**
   ```bash
   git add -A
   git commit -m "Add Supabase Edge Function contact system"
   git push origin main
   ```

2. **Visit your site** and test the contact form

3. **Check results**:
   - **Database**: Supabase → Tables → `contacts` (should see new row)
   - **Email**: Check your inbox at `avntae7@gmail.com` for the email
   - **Logs**: Supabase → Edge Functions → `send-contact` → View logs

---

## Troubleshooting

### Email not received
- Check `RESEND_API_KEY` is set correctly in Supabase secrets
- Verify email address in Resend dashboard (may need domain verification)
- Check Edge Function logs for errors

### Form submission fails
- Check browser console for network errors
- Verify `SUPABASE_URL` and anon key in frontend config
- Check Vercel function logs: **Deployments** → **Functions** tab

### Row not in database
- Check if table `contacts` exists in Supabase
- Verify RLS policies allow public inserts
- Check Edge Function logs for database errors

### CORS errors
- The Edge Function has CORS headers enabled (should be fine)
- Check browser console for specific CORS error details

---

## File Structure

```
.
├── functions/send-contact/index.ts       ← Edge Function (main backend)
├── src/components/Contact.tsx            ← Frontend form (updated)
├── supabase-setup.sql                    ← Database setup script
└── .env.example                          ← Environment variables reference
```

---

## Next Steps (Optional)

1. **Custom domain in Resend**: Verify a custom domain for a professional sender address
2. **Admin dashboard**: View all contact submissions in Supabase
3. **Notifications**: Get Slack/Discord alerts on new submissions
4. **Template emails**: Use Resend templates for better email formatting

---

## Support

For issues:
- Resend API errors: Check [Resend docs](https://resend.com/docs)
- Supabase issues: Check [Supabase docs](https://supabase.com/docs)
- Edge Function errors: Check function logs in Supabase dashboard
