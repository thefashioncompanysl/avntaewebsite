# AVNTAE
The world's premier destination for connecting visionary fashion designers with elite enterprises.

## Contact delivery
Contact submissions are stored in Supabase and can also be sent immediately through the serverless endpoint at `api/send_email.ts`.

### Required environment variables
Set these in your hosting platform:

- `RESEND_API_KEY`
- `SENDER_EMAIL`
- `RECEIVER_EMAIL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Deploying with Resend
1. Create a free Resend account.
2. Verify your sending domain or single sender address in Resend.
3. Create an API key with email-sending access.
4. Add the variables above in Vercel.
5. Deploy the project.
6. Verify a contact form submission reaches `avntae7@gmail.com`.

### Local development
```bash
npm install
npm run dev
```
