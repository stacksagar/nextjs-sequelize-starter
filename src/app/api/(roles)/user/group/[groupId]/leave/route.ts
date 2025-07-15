import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import GroupMember from "@/models/GroupMember";
import { getSessionUser } from "@/utils/auth";
import Deal from "@/models/Deal";

// POST /api/user/group/[groupId]/leave - Leave a group
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

    const group = await Group.findByPk(groupId, {
      include: [
        { model: Deal, as: "deal" },
        { model: GroupMember, as: "groupMembers" },
      ],
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const member = await GroupMember.findOne({
      where: { groupId, userId: user.id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Not a group member" },
        { status: 400 }
      );
    }

    // If creator, prevent leaving (or transfer ownership logic)
    if (group.creatorId === user.id) {
      return NextResponse.json(
        { error: "Creator cannot leave group" },
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
      message: "Successfully left group",
      groupId,
      currentMembers: updatedCount,
      groupStatus:
        group.status === GroupStatus.FULL && updatedCount < minGroupSize
          ? GroupStatus.OPEN
          : group.status,
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json(
      { error: "Failed to leave group" },
      { status: 500 }
    );
  }
}
