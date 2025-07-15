import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import GroupMember, { GroupMemberStatus } from "@/models/GroupMember";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import Deal from "@/models/Deal";
import paymentProcessing from "../../../cart/checkout/paymentProcessing";
import Notification from "@/models/Notification";
import { sendEmail } from "@/lib/sendEmail";
import { getUser } from "@/server/user.actions";
import Voucher from "@/models/Voucher";

// POST /api/groups/[groupId]/checkout - Process checkout for a group member
export async function POST(req: NextRequest, { params }: any) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentMethod, option, address } = body;

    const { groupId } = params;
    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: Deal,
          as: "deal",
          include: [{ model: Voucher, as: "voucher" }],
        },
        { model: GroupMember, as: "groupMembers" },
      ],
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if group is full
    if (group.status !== GroupStatus.FULL) {
      return NextResponse.json(
        { error: "Group is not ready for checkout" },
        { status: 400 }
      );
    }

    // Check if user is in group
    const groupMember = group.groupMembers?.find((m) => m.userId === user.id);
    if (!groupMember) {
      return NextResponse.json(
        { error: "Not a member of this group" },
        { status: 400 }
      );
    }

    // Check if already paid
    if (groupMember.paymentStatus === GroupMemberStatus.PAID) {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    // Calculate payment: pricePerPerson / requiredMembers
    const pricePerPerson = group.deal?.pricePerPerson
      ? Number(group.deal.pricePerPerson)
      : 0;
    const requiredMembers = group.deal?.requiredMembers || 1;
    const paymentAmount =
      requiredMembers > 0 ? Math.round(pricePerPerson / requiredMembers) : 0;

    // Simulate payment processing logic (skip real payment for now)
    const { success } = await paymentProcessing();
    if (!success) {
      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 500 }
      );
    }

    // Update member payment status
    await groupMember.update({ paymentStatus: GroupMemberStatus.PAID });
    await groupMember.save();

    // Create Order for this user if not already created
    let order = await Order.findOne({
      where: { userId: user.id, groupId: group.id },
    });

    if (!order) {
      order = await Order.create({
        userId: user.id,
        amount: paymentAmount,

        dealId: group.dealId,
        groupId: group.id,

        paymentStatus: "paid",
        type: group.deal?.type || "digital",
        option,
        deliveryAddress: {
          address,
        },
        paidAt: new Date(),
      });
    }

    // Create Transaction for this payment
    await Transaction.create({
      userId: user.id,
      orderId: order.id,
      amount: paymentAmount,
      method: paymentMethod || "card",
      status: "completed",
      transactionId: `txn_${Date.now()}`,
      paidAt: new Date(),
    });

    // Create Notification for the user
    await Notification.create({
      userId: user.id,
      type: "order",
      title: "Group Payment Successful",
      message: `Your payment for the group deal '${group.deal?.title}' was successful. Thank you for participating!`,
      read: false,
      url: `/dashboard/transactions`,
    });

    // Send confirmation email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Payment Successful for Group Deal: ${group.deal?.title}`,
        body: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px;">
        <h2 style="color: #060acd;">Payment Successful!</h2>
        <p style="font-size: 16px; color: #333;">Thank you for your payment for the group deal <b>${
          group.deal?.title
        }</b>.</p>
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Amount paid: <b>₦${paymentAmount.toLocaleString()}</b></p>
        <p style="font-size: 14px; color: #888;">You can view your group status and order details in your account.</p>
        <p style="font-size: 14px; color: #888;">Thank you for using Kuponna!</p>
      </div>`,
      });
    }

    // Check if all members have paid
    const unpaidMembers = group.groupMembers?.filter(
      (m: any) => m.paymentStatus !== GroupMemberStatus.PAID
    );
    // If all paid, update group status to completed
    if (unpaidMembers?.length === 0) {
      group?.groupMembers?.forEach(async (member) => {
        await Notification.create({
          userId: member.userId,
          type: "order",
          title: `Voucher for the group deal`,
          message: `Here is your voucher for the group deal <b>${group.deal?.title}</b>.`,
          read: false,
          url: `/dashboard/orders`,
        });

        await sendEmail({
          to: user?.email || "",
          subject: `Check your voucher for the deal ${group?.deal?.title}`,
          body: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px;">
        <h2 style="color: #060acd;">Voucher for the deal ${group?.deal?.title}</h2> 
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Voucher code: <b>${group?.deal?.voucher?.code}</b></p>
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Voucher valid until: <b>${group?.deal?.voucher?.validUntil}</b></p>
        <p style="font-size: 15px; color: #444; margin: 16px 0;">Voucher Description: <b>${group?.deal?.voucher?.description}</b></p> 
        <p style="font-size: 14px; color: #888;">Thank you for using Kuponna!</p>
      </div>`,
        });
      });

      await group.update({ status: GroupStatus.COMPLETED });
      await group.save();
    }

    // Create Notification for group member payment success
    unpaidMembers?.forEach(async (member) => {
      if (member.userId !== user.id) {
        await Notification.create({
          userId: member.userId,
          type: "order",
          title: `Group Member Paid`,
          message: `A member has paid for the group deal '${group.deal?.title}'. Only ${unpaidMembers.length} members left to pay!`,
          read: false,
          url: `/checkout/${group.id}`,
        });
      }
    });

    return NextResponse.json({
      success: true,
      paymentStatus: "paid",
      groupStatus:
        unpaidMembers?.length === 0 ? GroupStatus.COMPLETED : group.status,
      message: "Payment successful",
      paymentAmount,
    });
  } catch (error) {
    console.error("Error processing group checkout:", error);
    return NextResponse.json(
      { error: "Failed to process group checkout", errors: error },
      { status: 500 }
    );
  }
}
