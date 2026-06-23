# AVNTAE
The world's premier destination for connecting visionary fashion designers with elite enterprises.

## Contact delivery
Contact submissions are handled via a PHP backend service.

### Setting up EmailJS for contact form
1. Create a free EmailJS account.
2. Add an email service in the Email Services section.
3. Create an email template with fields for `from_name`, `from_email`, `reply_to`, `message`, and `to_email`.
4. Copy the Service ID, Template ID, and Public Key into your environment variables.
5. Deploy the project.
6. Verify a contact form submission reaches your email.

### Required environment variables
Set these in your hosting platform:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

### Local development
```bash
npm install
npm run dev
```
