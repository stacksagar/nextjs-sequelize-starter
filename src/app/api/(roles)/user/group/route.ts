import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import GroupMember, { GroupMemberStatus } from "@/models/GroupMember";
import Deal from "@/models/Deal";
import User from "@/models/User"; // Assuming User model is needed for authentication
import { getUser } from "@/server/user.actions"; // Assuming you have an auth helper
import { sendEmail } from "@/lib/sendEmail";
import { getGroupCreatedEmailTemplate } from "@/templates/groupCreatedEmail";
import Notification from "@/models/Notification";

// Helper to check if a user is a member of a group
async function isUserGroupMember(
  userId: string,
  groupId: string
): Promise<boolean> {
  const member = await GroupMember.findOne({
    where: { userId, groupId },
  });
  return !!member;
}

// GET /api/user/group - List user's groups or get a specific group
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const dealId = searchParams.get("dealId");

    if (groupId) {
      // Get a specific group
      const group = await Group.findByPk(groupId, {
        include: [
          { model: Deal, as: "deal" },
          { model: User, as: "creator", attributes: ["id", "name", "picture"] },
          {
            model: GroupMember,
            as: "groupMembers",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "picture"],
              },
            ],
          },
        ],
      });

      if (!group) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }

      // Ensure the user is a member of this group to view it
      const isMember = await isUserGroupMember(user.id, groupId);
      if (!isMember && group.creatorId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Calculate current members and check if full
      const currentMembers = group.groupMembers?.length || 0;
      const minGroupSize = group.deal?.requiredMembers || 1; // Default to 1 if not set
      const isFull = minGroupSize > 1 && currentMembers >= minGroupSize;

      return NextResponse.json({ ...group.toJSON(), currentMembers, isFull });
    } else if (dealId) {
      // Get a specific group
      const group = await Group.findOne({
        where: { dealId, creatorId: user?.id },

        include: [
          { model: Deal, as: "deal" },
          { model: User, as: "creator", attributes: ["id", "name", "picture"] },
          {
            model: GroupMember,
            as: "groupMembers",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "picture"],
              },
            ],
          },
        ],
      });

      if (!group) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }

      // Ensure the user is a member of this group to view it
      const isMember = await isUserGroupMember(user.id, group?.id);
      if (!isMember && group.creatorId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Calculate current members and check if full
      const currentMembers = group.groupMembers?.length || 0;
      const minGroupSize = group.deal?.requiredMembers || 1; // Default to 1 if not set
      const isFull = minGroupSize > 1 && currentMembers >= minGroupSize;

      return NextResponse.json({ ...group.toJSON(), currentMembers, isFull });
    } else {
      // List all groups the user is a member of
      const groupMemberships = await GroupMember.findAll({
        where: { userId: user.id },
        include: [
          {
            model: Group,
            as: "group",
            include: [
              {
                model: Deal,
                as: "deal",
                attributes: ["id", "title", "requiredMembers", "thumbnail"],
              },
              { model: User, as: "creator", attributes: ["id", "name"] },
              {
                model: GroupMember,
                as: "groupMembers",
                attributes: ["id", "userId"],
              }, // Include members to count
            ],
          },
        ],
      });

      const groups = groupMemberships
        .map((membership) => {
          const group = membership.group?.toJSON();
          if (!group) return null;
          const currentMembers = group.groupMembers?.length || 0;
          const minGroupSize = group.deal?.requiredMembers || 1;
          const isFull = minGroupSize > 1 && currentMembers >= minGroupSize;
          return { ...group, currentMembers, isFull };
        })
        .filter((group) => group !== null);

      return NextResponse.json({ items: groups });
    }
  } catch (error) {
    console.error("Error fetching group(s):", error);
    return NextResponse.json(
      { error: "Failed to fetch group(s)" },
      { status: 500 }
    );
  }
}

// POST /api/user/group - Create a new group
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { dealId, description } = body;

    if (!dealId) {
      return NextResponse.json(
        { error: "dealId is required" },
        { status: 400 }
      );
    }

    const deal = await Deal.findByPk(dealId, {
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
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Check if the deal is actually a group deal (requiredMembers > 1)
    if (!deal.requiredMembers || deal.requiredMembers <= 1) {
      return NextResponse.json(
        { error: "This is not a group deal" },
        { status: 400 }
      );
    }

    // Create the new group
    const group = await Group.create({
      dealId,
      creatorId: user.id, // Use creatorId as defined in Group model
      description: description || null,
      status: GroupStatus.OPEN,
    });

    // Add the creator as the first member of the group
    await GroupMember.create({
      groupId: group.id,
      userId: user.id,
      paymentStatus: GroupMemberStatus.PENDING,
    });

    // Send group created email to creator
    await sendEmail({
      to: user.email,
      subject: "Your Group Has Been Created!",
      body: getGroupCreatedEmailTemplate({
        name: user.name || "User",
        dealTitle: deal.title,
        minGroupSize: deal.requiredMembers,
      }),
    });

    // Create notification for creator
    await Notification.create({
      userId: user.id,
      type: "deal",
      title: "Group Created",
      message: `Your group for '${deal.title}' was created. Invite others to join and make it full to complete your purchase! Minimum members required: ${deal.requiredMembers}.`,
      read: false,
      url: `/deal/${deal?.id}`,
    });

    return NextResponse.json({ item: group }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group", errors: error },
      { status: 500 }
    );
  }
}

// PATCH /api/user/group - Update a group (e.g., description)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { groupId, description } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is required" },
        { status: 400 }
      );
    }

    const group = await Group.findByPk(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Only the creator can update the group
    if (group.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow updates if the group is still open
    if (group.status !== GroupStatus.OPEN) {
      return NextResponse.json(
        { error: "Cannot update group in this status" },
        { status: 400 }
      );
    }

    // Update group properties
    if (description !== undefined) {
      await group.update({ description });
    }

    // TODO: Add logic for inviting/removing members if needed (might be separate endpoints)

    return NextResponse.json({ item: group });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/group - Delete a group
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is required" },
        { status: 400 }
      );
    }

    const group = await Group.findByPk(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Only the creator can delete the group
    if (group.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow deletion if the group is open and no members have paid
    const members = await GroupMember.findAll({ where: { groupId } });
    const hasPaidMembers = members.some(
      (member) => member.paymentStatus === GroupMemberStatus.PAID
    );

    if (group.status !== GroupStatus.OPEN || hasPaidMembers) {
      return NextResponse.json(
        { error: "Cannot delete group in this status or with paid members" },
        { status: 400 }
      );
    }

    // Delete group members first
    await GroupMember.destroy({ where: { groupId } });

    // Delete the group
    await group.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
