import { NextRequest, NextResponse } from "next/server";
import RedemptionRequest from "@/models/RedemptionRequest";
import { isAdmin, isMerchant } from "@/server/user.actions";
import Order from "@/models/Order";
import User from "@/models/User";
import Deal from "@/models/Deal";

// Update any field(s) of a redemption request by id
export async function PUT(req: NextRequest) {
  try {
    await isMerchant();
    const { id, status, orderId, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const request = await RedemptionRequest.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Deal,
              as: "deal",
              include: [
                {
                  model: User,
                  as: "merchant",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!request) {
      return NextResponse.json(
        { error: "Redemption request not found" },
        { status: 404 }
      );
    }

    // Update the redemption request status
    await request.update({ status, ...updateData });

    // If status is completed, also update the related order and handle payment
    if (status === "completed" && request.order) {
      // Update order status to fulfilled
      await request.order.update({ status: "fulfilled" });

      // Handle merchant payment - move from book_balance to available_balance
      if (request.order.deal && request.order.deal.merchant) {
        const merchant = request.order.deal.merchant;
        const amount = Number(request.order.amount || 0);

        // Defensive: ensure balances are numbers
        const book_balance = Number(merchant.book_balance || 0);
        const available_balance = Number(merchant.available_balance || 0);

        // Transfer from book_balance to available_balance
        await merchant.update({
          book_balance: book_balance - amount,
          available_balance: available_balance + amount,
        });

        console.log(
          `Transferred ₦${amount} from book_balance to available_balance for merchant ${merchant.email}`
        );
      }
    }

    return NextResponse.json({
      message: "Redemption request updated successfully",
      request,
    });
  } catch (error: any) {
    console.error("Redemption verification error:", error);
    return NextResponse.json(
      { error: "Failed to update redemption request", errors: error },
      { status: 500 }
    );
  }
}
