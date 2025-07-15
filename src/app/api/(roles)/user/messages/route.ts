import { NextRequest, NextResponse } from "next/server";
import ChatGroup from "@/models/ChatGroup";
import ChatGroupMember from "@/models/ChatGroupMember";
import ChatMessage from "@/models/ChatMessage";
import User from "@/models/User";
import { Op } from "sequelize";
import { getUser } from "@/server/user.actions";
import { createChatGroupMembersWithAdmins } from "@/lib/chatHelpers";

// POST: Send a message (one-on-one or group)
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { chatGroupId, recipientId, content } = body;
    if (!content) {
      return NextResponse.json(
        { error: "Message content required" },
        { status: 400 }
      );
    }

    let groupId = chatGroupId;
    // If no chatGroupId, create/find a one-on-one group (isGroup: false)
    if (!groupId && recipientId) {
      // Find or create a one-on-one group (isGroup: false)
      let group = await ChatGroup.findOne({
        where: { isGroup: false },
        include: [
          {
            model: ChatGroupMember,
            as: "members",
            where: { userId: { [Op.in]: [user.id, recipientId] } },
          },
        ],
      });
      if (!group) {
        group = await ChatGroup.create({ name: "", isGroup: false });
        await createChatGroupMembersWithAdmins(group.id, [
          user.id,
          recipientId,
        ]);
      }
      groupId = group.id;
    }

    if (!groupId) {
      return NextResponse.json(
        { error: "chatGroupId or recipientId required" },
        { status: 400 }
      );
    }

    const message = await ChatMessage.create({
      chatGroupId: groupId,
      senderId: user.id,
      content,
      readBy: [user.id],
    });
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message", details: error },
      { status: 500 }
    );
  }
}

// GET: Fetch messages for a chat group or one-on-one chat
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const chatGroupId = searchParams.get("chatGroupId");
    const recipientId = searchParams.get("recipientId");

    let groupId = chatGroupId;
    if (!groupId && recipientId) {
      // Find the one-on-one group
      const group = await ChatGroup.findOne({
        where: { isGroup: false },
        include: [
          {
            model: ChatGroupMember,
            as: "members",
            where: { userId: { [Op.in]: [user.id, recipientId] } },
          },
        ],
      });
      if (!group) {
        return NextResponse.json({ messages: [] });
      }
      groupId = group.id;
    }
    if (!groupId) {
      return NextResponse.json(
        { error: "chatGroupId or recipientId required" },
        { status: 400 }
      );
    }
    const messages = await ChatMessage.findAll({
      where: { chatGroupId: groupId },
      order: [["createdAt", "ASC"]],
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "picture"] },
      ],
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error },
      { status: 500 }
    );
  }
}
