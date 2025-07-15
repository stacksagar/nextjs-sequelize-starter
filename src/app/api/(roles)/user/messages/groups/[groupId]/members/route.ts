import { NextRequest, NextResponse } from "next/server";
import ChatGroupMember from "@/models/ChatGroupMember";
import { getUser } from "@/server/user.actions";

// POST: Add a member to a group
export async function POST(req: NextRequest, { params }: any) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { groupId } = params;
    const body = await req.json();
    const { userId } = body;
    if (!groupId || !userId) {
      return NextResponse.json(
        { error: "groupId and userId required" },
        { status: 400 }
      );
    }
    // Only allow if current user is a member
    const isMember = await ChatGroupMember.findOne({
      where: { chatGroupId: groupId, userId: user.id },
    });
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Add member
    const member = await ChatGroupMember.create({
      chatGroupId: groupId,
      userId,
    });
    return NextResponse.json({ success: true, member });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add member", details: error },
      { status: 500 }
    );
  }
}

// DELETE: Remove a member from a group
export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { groupId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!groupId || !userId) {
      return NextResponse.json(
        { error: "groupId and userId required" },
        { status: 400 }
      );
    }
    // Only allow if current user is a member
    const isMember = await ChatGroupMember.findOne({
      where: { chatGroupId: groupId, userId: user.id },
    });
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Remove member
    await ChatGroupMember.destroy({ where: { chatGroupId: groupId, userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove member", details: error },
      { status: 500 }
    );
  }
}
