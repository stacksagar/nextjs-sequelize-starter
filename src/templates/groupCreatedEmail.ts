// src/templates/groupCreatedEmail.ts
export function getGroupCreatedEmailTemplate({
  name,
  dealTitle,
  minGroupSize,
}: {
  name: string;
  dealTitle: string;
  minGroupSize: number;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px;">
      <h2 style="color: #060acd;">Hi ${name}, your group has been created!</h2>
      <h3 style="color: #222;">Deal: <b>${dealTitle}</b></h3>
      <p style="font-size: 16px; color: #333;">Invite friends or others to join your group. Once your group reaches <b>${minGroupSize}</b> members, everyone can complete their purchase and enjoy the group deal price!</p>
      <ul style="font-size: 15px; color: #444; margin: 16px 0;">
        <li>Minimum members required: <b>${minGroupSize}</b></li>
        <li>Share your group link or invite by email from the deal page</li>
        <li>Once full, all members will be notified to pay</li>
      </ul>
      <p style="font-size: 14px; color: #888;">Thank you for using Kuponna!</p>
    </div>
  `;
}
