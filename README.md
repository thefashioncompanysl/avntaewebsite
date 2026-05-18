# AVNTAE
The world's premier destination for connecting visionary fashion designers with elite enterprises.

## Contact delivery
Contact submissions are sent directly through EmailJS from the client side.

### Required environment variables
Set these in your hosting platform:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Setting up EmailJS
1. Create a free EmailJS account.
2. Add an email service in the Email Services section.
3. Create an email template with fields for `from_name`, `from_email`, `reply_to`, `message`, and `to_email`.
4. Copy the Service ID, Template ID, and Public Key into your environment variables.
5. Deploy the project.
6. Verify a contact form submission reaches `avntae7@gmail.com`.

### Local development
```bash
npm install
npm run dev
```
