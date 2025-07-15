import { NextRequest, NextResponse } from "next/server";
import MerchantWithdraw from "@/models/MerchantWithdraw";
import Settings from "@/models/Settings";
import User from "@/models/User";

// POST: Merchant withdraw
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, amount, bankDetails } = data;
    if (!userId || !amount || !bankDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the first Setting
    const settingsArr = await Settings.findAll();
    const setting = settingsArr[0];
    if (!setting) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }
    const serviceChargePercent = Number(setting.serviceCharge) || 0;
    const serviceCharge = Math.round(
      (Number(amount) * serviceChargePercent) / 100
    );
    const netAmount = Math.max(Number(amount) - serviceCharge, 0);

    // Deduct netAmount from user's available_balance
    const user = await User.findByPk(userId);

    if ((user?.available_balance || 0) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }
    // Create MerchantWithdraw
    const withdraw = await MerchantWithdraw.create({
      userId,
      amount,
      serviceCharge,
      netAmount,
      status: "pending",
      bankDetails,
    });

    if (user) {
      const newBalance = Math.max(Number(user.available_balance) - amount, 0);
      await User.update(
        { available_balance: newBalance },
        { where: { id: userId } }
      );
    }

    // Update Setting.totalCharge
    const prevTotal = Number(setting.totalCharge) || 0;
    const newTotal = prevTotal + serviceCharge;
    await Settings.update(
      { totalCharge: newTotal },
      { where: { id: setting.id } }
    );

    return NextResponse.json(withdraw, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
