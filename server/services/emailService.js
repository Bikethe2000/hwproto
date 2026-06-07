const nodemailer = require('nodemailer');

let transporter = null;

async function initTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('Initializing SMTP transporter with configured credentials');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Fallback to ethereal test account for development
    console.log('SMTP credentials not fully configured, using Ethereal test account');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  return transporter;
}

async function sendEmail({ to, subject, text, html, fromName = 'HW Proto Studio' }) {
  try {
    const t = await initTransporter();
    const info = await t.sendMail({
      from: `${fromName} <no-reply@hwproto.studio>`,
      to,
      subject,
      text,
      html
    });

    // Return preview URL for test accounts
    const preview = nodemailer.getTestMessageUrl(info) || null;
    
    return {
      success: true,
      messageId: info.messageId,
      preview
    };
  } catch (err) {
    console.error('Email send error:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

async function sendNewAdminEmail({ email, name, tempPassword, createdBy }) {
  const subject = 'Welcome to HW Proto Studio - Admin Account Created';
  
  const text = `
Hello${name ? ` ${name}` : ''},

Your admin account has been created in HW Proto Studio.

Account Details:
- Email: ${email}
- Temporary Password: ${tempPassword}

To access the admin panel, please:
1. Visit https://hwproto.studio (or your local instance)
2. Go to the Login page
3. Enter your email: ${email}
4. Enter the temporary password: ${tempPassword}
5. Change your password immediately after logging in

Important: This temporary password should be kept secure and changed on first login.

If you did not request this account or have any questions, please contact ${createdBy}.

Best regards,
HW Proto Studio Admin Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { margin: 0; color: #2563eb; }
    .content { margin-bottom: 20px; }
    .credentials { background: #f3f4f6; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; font-family: monospace; }
    .credentials-label { font-weight: bold; color: #1f2937; display: block; margin-bottom: 5px; }
    .credentials-value { color: #374151; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; color: #92400e; }
    .steps { margin-left: 20px; }
    .steps ol { padding-left: 20px; }
    .steps li { margin-bottom: 10px; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to HW Proto Studio</h1>
    </div>
    
    <div class="content">
      <p>Hello${name ? ` <strong>${name}</strong>` : ''},</p>
      <p>Your admin account has been created in HW Proto Studio. You can now access the admin panel to manage the application.</p>
    </div>

    <div class="content">
      <h2>Account Details</h2>
      <div class="credentials">
        <span class="credentials-label">Email:</span>
        <span class="credentials-value">${email}</span>
      </div>
      <div class="credentials">
        <span class="credentials-label">Temporary Password:</span>
        <span class="credentials-value">${tempPassword}</span>
      </div>
    </div>

    <div class="warning">
      <strong>⚠️ Important:</strong> This is a temporary password. You must change it immediately after logging in for security reasons.
    </div>

    <div class="content">
      <h2>Getting Started</h2>
      <div class="steps">
        <ol>
          <li>Visit <strong>https://hwproto.studio</strong> (or your local instance)</li>
          <li>Click the <strong>Login</strong> button</li>
          <li>Enter your email: <code>${email}</code></li>
          <li>Enter the temporary password provided above</li>
          <li>Change your password immediately on first login</li>
        </ol>
      </div>
    </div>

    <div class="content">
      <p>If you did not request this account or have any questions, please contact <strong>${createdBy}</strong>.</p>
    </div>

    <div class="footer">
      <p>© 2024 HW Proto Studio. All rights reserved. This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    fromName: 'HW Proto Studio Admin'
  });
}

module.exports = {
  sendEmail,
  sendNewAdminEmail,
  initTransporter
};
