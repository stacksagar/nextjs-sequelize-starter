import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { isAdmin } from "@/server/user.actions";
import User from "@/models/User";
import Deal from "@/models/Deal";
import Group from "@/models/Group";

export async function PATCH(req: NextRequest) {
  try {
    await isAdmin();
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "user" },
        { model: Deal, as: "deal", include: [{ model: User, as: "merchant" }] },
        {
          model: Group,
          as: "group",
          include: [{ model: Order, as: "orders" }],
        },
      ],
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    await order.update({ status });

    if (order.deal && order.deal.merchant) {
      const merchantUser = order.deal.merchant;
      const user = order.user;
      const book_balance = Number(merchantUser.book_balance || 0);
      const available_balance = Number(merchantUser.available_balance || 0);
      const amount = Number(order.amount || 0);

      // If status is refunded, deduct from book_balance, add to user refund balance
      if (status === "refunded") {
        await merchantUser.update({
          book_balance: book_balance - amount,
        });

        await user?.update({
          refund_balance: Number(user.refund_balance || "0") + amount,
        });
      }

      // If status is fulfilled, (this action will be occurring when admin will reject user refund request)
      if (status === "fulfilled") {
        await merchantUser.update({
          book_balance: book_balance - amount,
          available_balance: available_balance + amount,
        });
      }
    }

    return NextResponse.json({ message: "Order status updated", order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
