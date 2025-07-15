import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import GroupMember from "@/models/GroupMember";
import { getSessionUser } from "@/utils/auth";
import Deal from "@/models/Deal";

// POST /api/user/group/[groupId]/remove - Remove a user from a group
export async function POST(req: NextRequest, { params }: any) {
  try {
    const user = await getSessionUser();
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

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required to remove" },
        { status: 400 }
      );
    }

    const group = await Group.findByPk(groupId, {
      include: [{ model: Deal, as: "deal" }],
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Only creator can remove
    if (group.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Only creator can remove members" },
        { status: 403 }
      );
    }

    // Cannot remove self
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Creator cannot remove self" },
        { status: 400 }
      );
    }

    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) {
      return NextResponse.json(
        { error: "User not a group member" },
        { status: 400 }
      );
    }

    await member.destroy();

    // Get deal info for min group size
    const deal = group.deal;
    const minGroupSize = deal?.requiredMembers || 1;

    // If group was full, check if it should be open again
    const updatedCount = await GroupMember.count({ where: { groupId } });
    if (group.status === GroupStatus.FULL && updatedCount < minGroupSize) {
      await group.update({ status: GroupStatus.OPEN });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully removed group member",
      removedUserId: userId,
      groupId,
      currentMembers: updatedCount,
      groupStatus:
        group.status === GroupStatus.FULL && updatedCount < minGroupSize
          ? GroupStatus.OPEN
          : group.status,
    });
  } catch (error) {
    console.error("Error removing group member:", error);
    return NextResponse.json(
      { error: "Failed to remove group member" },
      { status: 500 }
    );
  }
}
