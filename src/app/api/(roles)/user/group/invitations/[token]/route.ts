import { NextRequest, NextResponse } from "next/server";
import GroupInvitation from "@/models/GroupInvitation";
import Group from "@/models/Group";
import Deal from "@/models/Deal";
import User from "@/models/User";
import GroupMember from "@/models/GroupMember";
import { Op } from "sequelize";
import { getSessionUser } from "@/utils/auth";
import { getUser } from "@/server/user.actions";

// GET /api/user/group/invitations/[token] - Validate invitation token and get details
export async function GET(req: NextRequest, { params }: any) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: "Invitation token is required" },
        { status: 400 }
      );
    }

    // Find the invitation by token and check if it's expired
    const invitation = await GroupInvitation.findOne({
      where: {
        token,
        expiresAt: { [Op.gt]: new Date() }, // Check if not expired
      },
      include: [
        {
          model: Group,
          as: "group",
          include: [
            { model: Deal, as: "deal" },
            {
              model: User,
              as: "creator",
              attributes: ["id", "name", "picture"],
            },
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
        },
      ],
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation token" },
        { status: 404 }
      );
    }

    // Check if the group is already full or completed
    if (invitation.group?.status !== "open") {
      return NextResponse.json(
        { error: `Group is no longer open (${invitation.group?.status})` },
        { status: 400 }
      );
    }

    // Check if the invitee is already a member of the group
    const user = await getUser();
    if (user) {
      const isAlreadyMember = invitation.group?.groupMembers?.some(
        (member) => member.userId === user.id
      );
      if (isAlreadyMember) {
        return NextResponse.json(
          { error: "You are already a member of this group" },
          { status: 400 }
        );
      }
      // Optional: Check if the logged-in user's email matches the invitee email
      if (user.email !== invitation.inviteEmail) {
        // This case might happen if a user is logged in but clicks an invite link sent to a different email
        // We could handle this by showing a message or requiring them to log in with the correct email
        // For now, we'll return an error.
        return NextResponse.json(
          { error: "This invitation is for a different user." },
          { status: 403 }
        );
      }
    } else {
      // If user is not logged in, they will be prompted to log in/sign up on the frontend.
      // We still return the invitation details so the frontend can display them.
    }

    // Return invitation and group details
    return NextResponse.json({
      success: true,
      invitation: {
        // Return necessary invitation details
        id: invitation.id,
        groupId: invitation.groupId,
        inviteEmail: invitation.inviteEmail,
        expiresAt: invitation.expiresAt,
      },
      group: {
        // Return necessary group details
        id: invitation.group.id,
        status: invitation.group.status,
        description: invitation.group?.dataValues?.description || null,
        creator: invitation.group.creator
          ? {
              id: invitation.group.creator.id,
              name: invitation.group.creator.name,
              picture: invitation.group.creator.picture,
            }
          : null,
        currentMembers: invitation.group.groupMembers?.length || 0,
        deal: invitation.group.deal
          ? {
              id: invitation.group.deal.id,
              title: invitation.group.deal.title,
              requiredMembers: invitation.group.deal.requiredMembers,
              thumbnail: invitation.group.deal.thumbnail,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error validating invitation token:", error);
    return NextResponse.json(
      { error: "Failed to validate invitation token" },
      { status: 500 }
    );
  }
}
