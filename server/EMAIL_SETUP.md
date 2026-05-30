# Email Service Setup Guide

The application now sends automated emails when new admins are created. Follow this guide to configure email sending.

## Quick Start with Gmail

### 1. Enable 2-Factor Authentication
- Go to [Google Account Security](https://myaccount.google.com/security)
- Under "Your Google Account", click the "Security" tab
- Enable 2-Step Verification if not already enabled

### 2. Generate App Password
- Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
- Select "Mail" as the app
- Select "Windows Computer" (or your device/OS)
- Google will generate a 16-character password
- Copy this password

### 3. Update Environment Variables
Edit `/server/.env` and set:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
SMTP_SECURE=false
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-app-password-here` with the 16-character app password from step 2

### 4. Restart the Server
```bash
cd server
npm run dev
```

## Using Other Email Providers

### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-api-key-here
SMTP_SECURE=false
```

### AWS SES
```
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password
SMTP_SECURE=false
```

### Outlook/Office 365
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_SECURE=false
```

## Testing Without Real Email

If SMTP credentials are not configured, the system falls back to using Ethereal Email (a test email service).
The response will include a `preview` URL where you can view the test email.

## Email Templates

The system sends:

### New Admin Invitation Email
**Triggered:** When an admin creates a new admin account
**Contains:**
- Welcome message
- Temporary password
- Login instructions
- Password change requirement

## Troubleshooting

### "Email send error"
1. Verify SMTP credentials are correct
2. Check that 2FA is enabled (for Gmail)
3. Ensure the app password is the full 16-character version (no spaces)
4. For Gmail: Verify the account allows less secure apps if using regular password

### "Failed to send email"
- Check server logs for detailed error message
- The admin account will still be created even if email fails
- You can manually share the temporary password

### Testing Email Delivery
- Look for the `email_preview` link in the success response
- Click it to view the test email in Ethereal
- For production emails, check your email provider's logs

## Security Notes

- **Never commit** actual email credentials to version control
- Use environment variables for sensitive data
- For Gmail: Use App Passwords, not your regular password
- Consider using dedicated service accounts for email sending
