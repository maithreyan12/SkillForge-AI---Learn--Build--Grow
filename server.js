/**
 * SkillForge AI – Express Backend Server
 * Author  : Maithreyan <maithreyan2006@gmail.com>
 * Location: Vellore, Tamil Nadu, India
 *
 * Endpoints
 *   POST /api/contact    – Save message to JSON DB + email admin + auto-reply
 *   POST /api/newsletter – Save subscriber email to JSON DB + welcome email
 *   GET  /api/stats      – Return public site stats (submissions count)
 *   GET  /               – Serve the static frontend
 */

'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Pure-JS JSON file database (no native compilation required)
const db = require('./db');

// ─── App Setup ───────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Nodemailer Transport ─────────────────────────────────────────────────────
let transporter;
let senderEmail;

if (process.env.RESEND_API_KEY) {
  transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });
  senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
} else {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  senderEmail = process.env.GMAIL_USER || 'maithreyan2006@gmail.com';
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files (index.html, style.css, script.js, assets/) from root
app.use(express.static(path.join(__dirname)));

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5,
  message: { success: false, error: 'Too many requests. Please try again after 15 minutes.' },
});

const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1-hour window
  max: 3,
  message: { success: false, error: 'Too many subscribe attempts. Please try again later.' },
});

// ─── Helper: Send email (graceful — never crashes the request) ───────────────
async function sendMail(options) {
  try {
    await transporter.sendMail(options);
    return true;
  } catch (err) {
    console.warn('[Nodemailer] Could not send email:', err.message);
    return false;
  }
}

// ─── Route: POST /api/contact ─────────────────────────────────────────────────
app.post(
  '/api/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 4000 }),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, message } = req.body;

    // 1. Save to JSON database
    try {
      db.insertContact({ name, email, message });
    } catch (err) {
      console.error('[DB insertContact]', err.message);
      return res.status(500).json({ success: false, error: 'Could not save message. Please try again.' });
    }

    // 2. Notify admin
    await sendMail({
      from: `"SkillForge AI Website" <${senderEmail}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact from ${name} – SkillForge AI`,
      html: `
        <div style="font-family:Inter,sans-serif;background:#0b0f19;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#00f2fe;margin-top:0">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94a3b8;width:100px">Name</td>
                <td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8">Email</td>
                <td style="padding:8px 0"><a href="mailto:${email}" style="color:#38bdf8">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;vertical-align:top">Message</td>
                <td style="padding:8px 0;white-space:pre-wrap">${message}</td></tr>
          </table>
          <hr style="border-color:#1e293b;margin:24px 0"/>
          <p style="color:#64748b;font-size:13px;margin:0">Sent from SkillForge AI – Vellore, Tamil Nadu, India</p>
        </div>
      `,
    });

    // 3. Auto-reply to the sender
    await sendMail({
      from: `"SkillForge AI" <${senderEmail}>`,
      to: email,
      subject: `We've received your message, ${name}! ✅`,
      html: `
        <div style="font-family:Inter,sans-serif;background:#0b0f19;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#00f2fe;margin-top:0">Hello, ${name}! 👋</h2>
          <p style="color:#94a3b8;line-height:1.7">
            Thank you for reaching out to <strong style="color:#fff">SkillForge AI</strong>.<br/>
            We've received your message and our team will get back to you within
            <strong style="color:#38bdf8">24 hours</strong>.
          </p>
          <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:20px;margin:24px 0">
            <p style="color:#64748b;font-size:13px;margin:0 0 8px 0">YOUR MESSAGE</p>
            <p style="color:#cbd5e1;white-space:pre-wrap;margin:0">${message}</p>
          </div>
          <a href="http://localhost:${PORT}/#pathfinder"
             style="display:inline-block;background:linear-gradient(135deg,#00f2fe,#38bdf8);color:#000;font-weight:700;padding:12px 28px;border-radius:9999px;text-decoration:none">
            Explore AI Pathfinder →
          </a>
          <hr style="border-color:#1e293b;margin:24px 0"/>
          <p style="color:#64748b;font-size:12px;margin:0">
            SkillForge AI · Vellore, Tamil Nadu, India<br/>
            <a href="mailto:maithreyan2006@gmail.com" style="color:#38bdf8">maithreyan2006@gmail.com</a>
          </p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: `Thank you, ${name}! Your message has been saved. Check your inbox for a confirmation email.`,
    });
  }
);

// ─── Route: POST /api/newsletter ──────────────────────────────────────────────
app.post(
  '/api/newsletter',
  newsletterLimiter,
  [body('email').isEmail().normalizeEmail().withMessage('Valid email required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    let result;
    try {
      result = db.insertSubscriber(email);
    } catch (err) {
      console.error('[DB insertSubscriber]', err.message);
      return res.status(500).json({ success: false, error: 'Could not save subscription.' });
    }

    if (!result.inserted) {
      return res.json({ success: true, message: 'You are already subscribed! 🎉' });
    }

    // Welcome email to subscriber
    await sendMail({
      from: `"SkillForge AI" <${senderEmail}>`,
      to: email,
      subject: '🎓 Welcome to SkillForge AI Newsletter!',
      html: `
        <div style="font-family:Inter,sans-serif;background:#0b0f19;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#00f2fe;margin-top:0">You're subscribed! 🚀</h2>
          <p style="color:#94a3b8;line-height:1.7">
            Welcome to the <strong style="color:#fff">SkillForge AI</strong> weekly newsletter.<br/>
            Every week you'll receive curated project ideas, AI engineering tips, and new track announcements directly to your inbox.
          </p>
          <hr style="border-color:#1e293b;margin:24px 0"/>
          <p style="color:#64748b;font-size:12px;margin:0">
            SkillForge AI · Vellore, Tamil Nadu, India
          </p>
        </div>
      `,
    });

    // Admin notification
    await sendMail({
      from: `"SkillForge AI" <${senderEmail}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📬 New Newsletter Subscriber: ${email}`,
      html: `<p style="font-family:sans-serif"><strong>${email}</strong> just subscribed to the SkillForge AI newsletter.</p>`,
    });

    return res.json({
      success: true,
      message: 'Subscribed successfully! Check your inbox for a welcome email. 🎉',
    });
  }
);

// ─── Route: GET /api/stats ────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Could not read stats.' });
  }
});

// ─── Catch-all: serve index.html for any unmatched GET ───────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║           SkillForge AI – Backend Server             ║
║  Author  : Maithreyan <maithreyan2006@gmail.com>     ║
║  Location: Vellore, Tamil Nadu, India                ║
╠══════════════════════════════════════════════════════╣
║  🌐  http://localhost:${PORT}                            ║
║  📡  POST /api/contact                               ║
║  📡  POST /api/newsletter                            ║
║  📡  GET  /api/stats                                 ║
╚══════════════════════════════════════════════════════╝
    `);
  });
}

module.exports = app;
