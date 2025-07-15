import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your Brevo SMTP login
    pass: process.env.SMTP_PASS, // your Brevo SMTP master password
  },
});

export const sendEmail = async ({
  to,
  subject,
  body,
}: {
  to?: string;
  subject: string;
  body: string;
}) => {
  // Verify SMTP connection configuration
  await transporter.verify();

  const info = await transporter.sendMail({
    from: "kuponna.com <" + process.env.SMTP_USER + ">", // use your verified sender email
    to,
    subject,
    html: body,
  });

  return info;
};
