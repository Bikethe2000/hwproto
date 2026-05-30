#!/usr/bin/env node
/**
 * Quick test script for email service
 * Run: node test-email.js
 */
const { sendNewAdminEmail } = require('./services/emailService');
require('dotenv').config();

async function test() {
  console.log('\n=== Email Service Test ===\n');
  
  console.log('Testing email configuration...');
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST || '(not set - will use Ethereal)'}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER ? '***' : '(not set)'}`);
  console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '***' : '(not set)'}\n`);

  try {
    const result = await sendNewAdminEmail({
      email: 'test@example.com',
      name: 'Test Admin',
      tempPassword: 'ABC12345',
      createdBy: 'admin@hwproto.studio'
    });

    if (result.success) {
      console.log('✓ Email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
      if (result.preview) {
        console.log(`\nTest Email Preview: ${result.preview}`);
        console.log('(Click link above to view the test email)\n');
      }
    } else {
      console.log(`✗ Email send failed: ${result.error}`);
      console.log('\nTroubleshooting:');
      console.log('1. Check SMTP credentials in .env');
      console.log('2. For Gmail: ensure App Password is enabled');
      console.log('3. Read EMAIL_SETUP.md for detailed instructions');
    }
  } catch (err) {
    console.error('✗ Error:', err.message);
  }
}

test();
