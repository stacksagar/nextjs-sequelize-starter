import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import Deal from "@/models/Deal";
import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { uid } from "uid";
import paymentProcessing from "./paymentProcessing";
import { getUser } from "@/server/user.actions";
import Notification from "@/models/Notification";
import { sendEmail } from "@/lib/sendEmail";
import Voucher from "@/models/Voucher";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const body = await req.json();
    const {
      userId,
      dealId,
      dealIds,
      amount,
      paymentMethod,
      quantity,
      option,
      address,
    } = body;

    // Validate required fields
    if (!userId || !amount || !quantity) {
      return NextResponse.json(
        { error: "userId, amount, and quantity are required" },
        { status: 400 }
      );
    }

    // Simulate payment processing logic (skip real payment for now)
    const payment = await paymentProcessing();
    if (!payment.success) {
      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 500 }
      );
    }

    const orderPayload: any = {
      userId,
      amount,
      quantity,
      option,
      paymentStatus: "paid",
      deliveryAddress: {
        address,
      },
    };

    let allDealIds: string[] = [];
    if (dealId) {
      orderPayload.dealId = dealId;
      allDealIds.push(dealId);
    }
    if (dealIds) {
      const ids = Array.isArray(dealIds) ? dealIds : [dealIds];
      orderPayload.dealIds = ids;
      allDealIds = allDealIds.concat(ids);
    }

    // Increment soldCount for each deal
    if (allDealIds.length > 0) {
      await Promise.all(
        allDealIds.map(async (id) => {
          const deal = await Deal.findByPk(id, {
            include: [
              {
                model: Group,
                as: "groups",
                include: [
                  {
                    model: GroupMember,
                    as: "groupMembers",
                  },
                ],
                order: [["createdAt", "DESC"]],
              },
            ],
          });
          if (deal) {
            const currentSold = Number(deal.soldCount) || 0;
            await deal.update({ soldCount: currentSold + 1 });
            await deal.save();
          }
        })
      );
    }

    const order = await Order.create(orderPayload);

    const deal = await Deal.findByPk(dealId, {
      include: [
        { model: Voucher, as: "voucher" },
        {
          model: Group,
          as: "groups",
          include: [
            {
              model: GroupMember,
              as: "groupMembers",
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (deal?.voucher && deal?.type === "digital") {
      await order.update({ status: "delivered" });
      await order.save();
      await Notification.create({
        userId: user?.id,
        type: "order",
        title: `Voucher for the deal ${deal?.title}`,
        message: `Here is your voucher for the deal <b>${deal?.title}</b>.`,
        read: false,
        url: `/dashboard/orders`,
      });

      await sendEmail({
        to: user?.email || "",
        subject: `Check your voucher for the deal ${deal?.title}`,
        body: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px;">
        <h2 style="color: #060acd;">Voucher for the deal ${deal?.title}</h2> 
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Voucher code: <b>${deal?.voucher?.code}</b></p>
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Voucher valid until: <b>${deal?.voucher?.validUntil}</b></p>
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Voucher Description: <b>${deal?.voucher?.description}</b></p> 
        <p style="font-size: 14px; color: #888;">Thank you for using Kuponna!</p>
      </div>`,
      });
    }

    const transaction = await Transaction.create({
      userId,
      orderId: order.id,
      status: "completed",
      amount,
      method: paymentMethod,
      transactionId: uid(8)?.toUpperCase(),
    });

    // 1. Create Notification
    await Notification.create({
      userId,
      type: "order",
      title: "Order Placed",
      message: `Your order #${order.id} has been placed successfully.`,
      read: false,
      url: `/dashboard/orders/`,
    });

    // 2. Send Email
    await sendEmail({
      to: user?.email,
      subject: "Order Confirmation - Kuponna",
      body: `
    <h2>Thank you for your order!</h2>
    <p>Your order <b>#${order.id}</b> has been placed successfully.</p>
    <p>Order Amount: <b>${amount}</b></p>
    <p>You can view your order details in your <a href="https://kuponna.com/profile/orders/${order.id}">profile</a>.</p>
    <br/>
    <p>Thank you for shopping with Kuponna!</p>
  `,
    });

    await Cart.destroy({ where: { userId } });
    return NextResponse.json({
      message: "Checkout successful.",
      status: "success",
      order,
      transaction,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
