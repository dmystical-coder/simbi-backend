import { Request, Response } from 'express';
import { sendEmail } from '../services/email.services';

export const sendEmailController = async (req: Request, res: Response): Promise<void> => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};