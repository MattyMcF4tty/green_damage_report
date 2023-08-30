import nodemailer from "nodemailer";
import cors from "cors";

const corsMiddleware = cors({
  origin: "*", // Replace with the appropriate origin(s) of your frontend
  methods: ["POST", "OPTIONS"], // Allow the specified methods
  allowedHeaders: ["Content-Type"], // Allow the specified headers
});

export default async function handler(req, res) {
  // Apply the cors middleware
  corsMiddleware(req, res, async () => {
    // Rest of your API logic...
    if (req.method !== "POST") {
      return res.status(405).end(); // Method Not Allowed
    }

    const transporter = nodemailer.createTransport({
      // Your email configuration here
      service: "Gmail",
      auth: {
        user: "carloslundrodriguez@gmail.com", // Your Gmail address
        pass: "Carlos160704", // Your Gmail app password
      },
    });

    const mailOptions = {
      from: "carloslundrodriguez@gmail.com",
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ error: "An error occurred while sending the email" });
    }
  });
}
