import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import GroupMember, { GroupMemberStatus } from "@/models/GroupMember";
import { getSessionUser } from "@/utils/auth";
import Deal from "@/models/Deal";
import { sendEmail } from "@/lib/sendEmail";
import Notification from "@/models/Notification";
import groupFullNotifyEmail from "@/templates/groupFullNotifyEmail";
import { getUser } from "@/server/user.actions";

// POST /api/user/group/[groupId]/join - Join a group
export async function POST(req: NextRequest, { params }: any) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is required" },
        { status: 400 }
      );
    }

    const group = await Group.findByPk(groupId, {
      include: [
        { model: Deal, as: "deal" },
        { model: GroupMember, as: "groupMembers" },
      ],
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const deal = group.deal;
    const minGroupSize = deal?.requiredMembers || 1;
    const currentMembers = group.groupMembers?.length || 0;

    // Check if already a member
    const existing = await GroupMember.findOne({
      where: { groupId, userId: user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    // Check if group is full
    if (minGroupSize > 1 && currentMembers >= minGroupSize) {
      return NextResponse.json({ error: "Group is full" }, { status: 400 });
    }

    await GroupMember.create({
      groupId,
      userId: user.id,
      paymentStatus: GroupMemberStatus.PENDING,
    });

    // Notify the user who just joined
    const dealTitle = deal?.title || "a group deal";
    await Notification.create({
      userId: user.id,
      type: "deal",
      title: "Joined Group",
      message: `You have joined a group for '${dealTitle}'. Invite others to fill the group and unlock the group deal!`,
      read: false,
      url: `/deal/${deal?.id}`,
    });
    await sendEmail({
      to: user.email,
      subject: `You joined a group for ${dealTitle}`,
      body: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eee; padding: 32px;">
        <h2 style="color: #060acd;">You joined a group for: <b>${dealTitle}</b></h2>
        <p style="font-size: 16px; color: #333;">Invite friends or others to join. Once your group is full, everyone can pay and enjoy the group deal price!</p>
        <ul style="font-size: 15px; color: #444; margin: 16px 0;">
          <li>Minimum members required: <b>${minGroupSize}</b></li>
        </ul>
        <p style="font-size: 14px; color: #888;">Thank you for using Kuponna!</p>
      </div>`,
    });

    // If group is now full, update status and notify
    const updatedCount = await GroupMember.count({ where: { groupId } });
    if (minGroupSize > 1 && updatedCount >= minGroupSize) {
      await group.update({ status: GroupStatus.FULL });
      // Notify all members by email and Notification
      const fullGroup = await Group.findByPk(groupId, {
        include: [
          { model: GroupMember, as: "groupMembers", include: ["user"] },
          { model: Deal, as: "deal" },
        ],
      });
      if (fullGroup && fullGroup.groupMembers && fullGroup.deal) {
        for (const member of fullGroup.groupMembers) {
          // Send email
          if (member.user && member.user.email) {
            await sendEmail({
              to: member.user.email,
              subject: "Your Group is Full! Payment Required",
              body: groupFullNotifyEmail({
                user: member.user,
                deal: fullGroup.deal,
                currentMembers: updatedCount,
                paymentLink: `${process.env.DOMAIN}/checkout/${groupId}`,
              }),
            });
          }
          // Create Notification
          await Notification.create({
            userId: member.userId,
            type: "deal",
            title: "Group is Full - Payment Required",
            message: `Your group for '${fullGroup.deal.title}' is now full. Please complete your payment to enjoy the group deal!`,
            read: false,
            url: `/checkout/${groupId}`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined group",
      groupId,
      currentMembers: updatedCount,
      groupStatus:
        updatedCount >= minGroupSize ? GroupStatus.FULL : GroupStatus.OPEN,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { error: "Failed to join group", errors: error },
      { status: 500 }
    );
  }
}
