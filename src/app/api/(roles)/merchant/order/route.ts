import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { isMerchant } from "@/server/user.actions";
import { sendEmail } from "@/lib/sendEmail";

export async function PATCH(req: NextRequest) {
  try {
    await isMerchant();
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }
    const order = await Order.findByPk(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    await order.update({ status });
    return NextResponse.json({ message: "Order status updated", order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await isMerchant();
    const { orderId, payableData } = await req.json();
    if (
      !orderId ||
      typeof payableData !== "object" ||
      Array.isArray(payableData) ||
      !Object.keys(payableData).length
    ) {
      return NextResponse.json(
        {
          error:
            "orderId and payableData (object with fields to update) are required",
        },
        { status: 400 }
      );
    }
    const order = await Order.findByPk(orderId, {
      include: ["user", "deal", "group"],
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    await order.update({ ...payableData });

    // If status is delivered, send email to user
    if (payableData.status === "delivered" && order.user && order.user.email) {
      try {
        const user = order.user;
        const deal = order.deal;
        const group = order.group;
        // Compose email body (customize as needed)
        const body = `
          <h2>Your Order Has Been Delivered!</h2>
          <p>Hi ${user.name || user.email},</p>
          <p>Your order for <b>${
            deal?.title || "Deal"
          }</b> has been marked as <b>Delivered</b>.</p>
          <ul>
            <li><b>Order ID:</b> ${order.id}</li>
            <li><b>Deal:</b> ${deal?.title || "-"}</li>
            <li><b>Group:</b> ${group?.id || "-"}</li>
            <li><b>Amount:</b> ₦${order.amount}</li>
            <li><b>Status:</b> Delivered</li>
          </ul>
          <p>If you have any questions, please contact support.</p>
          <p>Thank you for using Kuponna!</p>
        `;
        await sendEmail({
          to: user.email,
          subject: `Your Order (${deal?.title || "Deal"}) Has Been Delivered`,
          body,
        });
      } catch (e) {
        // Log but do not fail the request
        console.error("Failed to send delivery email", e);
      }
    }
    return NextResponse.json({ message: "Order updated", order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order files" },
      { status: 500 }
    );
  }
}
