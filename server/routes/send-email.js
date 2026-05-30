const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  const { to, subject, body, html, from_name } = req.body;
  if (!to || !subject) return res.status(400).json({ error: 'to and subject required' });
  try {
    const data = await resend.emails.send({
      from: `${from_name || 'HW Proto Studio'} <onboarding@resend.dev>`,
      to,
      subject,
      html: html || `<p>${body || ''}</p>`,
      text: body || undefined,
    });
    res.json({ ok: true, data });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;