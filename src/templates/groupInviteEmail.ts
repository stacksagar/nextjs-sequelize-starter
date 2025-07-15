// src/templates/groupInviteEmail.ts
export function getGroupInviteEmailTemplate({
  inviterName,
  dealTitle,
  invitationUrl,
}: {
  inviterName: string;
  dealTitle: string;
  invitationUrl: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px;">
      <h2 style="color: #060acd;">${inviterName} invited you to join a group for:</h2>
      <h3 style="color: #222;">${dealTitle}</h3>
      <p style="font-size: 16px; color: #333;">Click the button below to join the group and unlock a special group deal price!</p>
      <a href="${invitationUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #060acd; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">Join Group</a>
      <p style="font-size: 14px; color: #888;">This invitation link will expire in 60 Days.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 13px; color: #aaa;">If you did not expect this invitation, you can ignore this email.</p>
    </div>
  `;
}
