import { NextRequest, NextResponse } from "next/server";
import MerchantWithdraw from "@/models/MerchantWithdraw";
import { sendEmail } from "@/lib/sendEmail";

// POST: Mark merchant withdraw as completed
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing withdraw id" },
        { status: 400 }
      );
    }
    const withdraw = await MerchantWithdraw.findByPk(id);
    if (!withdraw) {
      return NextResponse.json(
        { error: "Withdraw request not found" },
        { status: 404 }
      );
    }
    if (withdraw.status === "completed") {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }
    await MerchantWithdraw.update({ status: "completed" }, { where: { id } });

    // Fetch user and send email
    try {
      const User = (await import("@/models/User")).default;
      const user = await User.findByPk(withdraw.userId);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: "Withdrawal Completed",
          body: `<p>Dear ${user.name || "Merchant"},</p>
            <p>Your withdrawal request of <b>₦${Number(
              withdraw.netAmount
            ).toLocaleString()}</b> has been <b>completed</b> and paid to your bank account.</p>
            <p>Thank you for using Kuponna!</p>`,
        });
      }
    } catch (e) {
      // Log but don't fail the request if email fails
      console.error("Failed to send withdraw completion email", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
