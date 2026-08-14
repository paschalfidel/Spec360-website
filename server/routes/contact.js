import express from 'express';
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const router = express.Router();
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

router.post('/', async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const message = String(req.body?.message || '').trim();
    if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Valid name, email and message are required' });
    if (!env.emailUser || !env.emailPass || !env.receiverEmail) return res.status(503).json({ message: 'Contact service is temporarily unavailable' });

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: env.emailUser, pass: env.emailPass } });
    await transporter.sendMail({
      from: `"Spec360 Contact" <${env.emailUser}>`,
      to: env.receiverEmail,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `<h3>New Contact Message</h3><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    });
    res.json({ message: 'Message sent successfully' });
  } catch (error) { next(error); }
});

export default router;
