import { NextRequest, NextResponse } from "next/server";
import ChatGroup from "@/models/ChatGroup";
import ChatGroupMember from "@/models/ChatGroupMember";
import { getUser } from "@/server/user.actions";
import User from "@/models/User";
import { createChatGroupMembersWithAdmins } from "@/lib/chatHelpers";

// POST: Create a new group chat
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { name, memberIds } = body;
    if (!name || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json(
        { error: "Name and memberIds[] required" },
        { status: 400 }
      );
    }

    // Always include creator
    const allMemberIds = Array.from(new Set([user.id, ...memberIds]));
    const group = await ChatGroup.create({ name, isGroup: true });
    await createChatGroupMembersWithAdmins(group.id, allMemberIds);
    return NextResponse.json({ success: true, group });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create group", details: error },
      { status: 500 }
    );
  }
}

// GET: List all chat groups for the current user
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const memberships = await ChatGroupMember.findAll({
      where: { userId: user.id },
      include: [{ model: ChatGroup, as: "chatGroup" }],
    });
    const groups = [];
    for (const m of memberships) {
      const group =
        typeof m.toJSON === "function" ? m.toJSON().chatGroup : undefined;
      if (!group) continue;
      // If not a group chat, fetch the other user's info
      if (!group.isGroup) {
        // Find the other member
        const members = await ChatGroupMember.findAll({
          where: { chatGroupId: group.id },
        });
        const otherMember = members.find((mem) => mem.userId !== user.id);
        if (otherMember) {
          const otherUser = await User.findByPk(otherMember.userId);
          if (otherUser) {
            group.name = otherUser.name;
            group.avatar = otherUser.picture;
          }
        }
      }
      groups.push(group);
    }
    return NextResponse.json({ groups });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch groups", details: error },
      { status: 500 }
    );
  }
}
