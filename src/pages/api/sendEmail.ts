// pages/api/send-email.ts
import { apiResponse } from '@/utils/types';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== 'POST') {
    return res.status(405).json(new apiResponse(
      "METHOD_NOT_ALLOWED",
      [],
      ["Method is not allowed"],
      {},
    ))  
  }
    const { toEmail, subject, text } = req.body;

    try {
      if (!toEmail || typeof toEmail !== 'string') {
        throw new Error('Incorrect user Email format');
      }
      if (!subject || typeof subject !== 'string') {
        throw new Error('Incorrect subject format');
      }
      if (!text || typeof text !== 'string') {
        throw new Error('Incorrect text format');
      }
    } catch ( error:any ) {
      return res.status(400).json(new apiResponse(
        "BAD_REQUEST",
        [],
        [error.message],
        {},
      ))
    }

    const emailName = process.env.EMAIL_NAME;
    const emailPass = process.env.EMAIL_PASS;

    try {
      if (!emailName || typeof emailName !== 'string') {
        throw new Error("EMAIL_NAME is not defined in enviroment variables")
      }
      if (!emailPass || typeof emailPass !== 'string') {
        throw new Error("EMAIL_PASS is not defined in enviroment variables")
      }
    } catch ( error:any ) {
      console.error(error.message)
      return res.status(500).json(new apiResponse(
        "SERVER_ERROR",
        [],
        ["Something went wrong"],
        {},
      ))  
    }

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
        await transporter.sendMail(mailOptions);
        res.status(200).json(new apiResponse(
          "OK",
          ["Mail send successfully"],
          [],
          {},
        ))
      } catch (error: any) {
        console.error("Something went wrong sending email", error.message)
        return res.status(500).json(new apiResponse(
          "SERVER_ERROR",
          [],
          ["Something went wrong"],
          {},
        ))  
      }
};
