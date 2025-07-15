export const getVerificationEmailTemplate = (
  verificationCode: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">Verify Your Email</h1>
          <p>Thank you for signing up! Please use the following code to verify your email address:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin: 0; letter-spacing: 5px;">${verificationCode}</h2>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
