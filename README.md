# AVNTAE
The world's premier destination for connecting visionary fashion designers with elite enterprises.

## Contact delivery
Contact submissions are stored in Supabase and can also be sent immediately through the serverless endpoint at `api/send_email.ts`.

### Required environment variables
Set these in your hosting platform:

- `SENDGRID_API_KEY`
- `SENDER_EMAIL`
- `RECEIVER_EMAIL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Deploying to Vercel
1. Link the repo to the Vercel project `website33`.
2. Add the environment variables above in the Vercel dashboard.
3. Deploy the project.
4. Verify a contact form submission reaches `avntae7@gmail.com`.

### Local development
```bash
npm install
npm run dev
```
