// pages/api/send-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { toEmail, subject, text } = req.body;

    const emailName = process.env.EMAIL_NAME;
    const emailPass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: emailName, 
          pass: emailPass
          ,
        },
    });

    const mailOptions = {
        from: emailName,
        to: toEmail,
        subject: subject,
        text: text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
      }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
