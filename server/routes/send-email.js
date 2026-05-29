const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

async function createTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  // fallback to ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, auth: { user: testAccount.user, pass: testAccount.pass } });
}

router.post('/', async (req, res) => {
  const { to, subject, body, html, from_name } = req.body;
  if (!to || !subject) return res.status(400).json({ error: 'to and subject required' });
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `${from_name || 'HW Proto Studio'} <no-reply@hwproto.studio>`,
      to,
      subject,
      text: body,
      html: html || undefined,
    });
    // If using ethereal, return preview URL
    const preview = nodemailer.getTestMessageUrl(info) || null;
    res.json({ ok: true, preview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
