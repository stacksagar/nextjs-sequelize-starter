import Deal from "@/models/Deal";
import Group from "@/models/Group";
import User from "@/models/User";

const groupFullNotifyEmail = ({
  user,
  deal,
  currentMembers = 1,
  paymentLink,
}: {
  user?: User;
  deal: Deal;
  currentMembers?: number;
  paymentLink?: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Group Full Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">Your Group is Full!</h1>
          ${user?.name ? `<p>Hello ${user.name},</p>` : ""}
          <p>Good news! The group for the deal "${
            deal.title
          }" has reached the min required size of ${
    deal?.requiredMembers || 1
  } members ${
    (deal?.requiredMembers || 1) > 1
      ? `, Total member joined ${currentMembers}.`
      : "."
  }   </p>
          <p>You can now proceed with your payment to secure your spot in the group.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <p style="margin-bottom: 15px;">Click the link below to complete your payment:</p>
            <a href="${
              paymentLink || "https://kuponna.com/checkout"
            }" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Proceed to Payment</a>
          </div>
          <p>If you have any questions, please contact support.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
export default groupFullNotifyEmail;
