import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import GroupMember, { GroupMemberStatus } from "@/models/GroupMember";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import { getSessionUser } from "@/utils/auth";
import { Op } from "sequelize";
import Deal from "@/models/Deal";
import { getUser } from "@/server/user.actions";
import User from "@/models/User";
import paymentProcessing from "../../../cart/checkout/paymentProcessing";

// GET /api/user/group/deal/full-group?dealId=...
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get("dealId");
    if (!dealId) {
      return NextResponse.json(
        { error: "dealId is required" },
        { status: 400 }
      );
    }
    // Find all full groups for this deal
    const fullGroups = await Group.findAll({
      where: {
        dealId,
        status: GroupStatus.FULL,
      },
      include: [
        {
          model: GroupMember,
          as: "groupMembers",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "picture"],
            },
          ],
        },
        { model: Deal, as: "deal" },
      ],
    });

    // Find the user's full group from fullGroups
    const userFullGroup = fullGroups.find((g: any) =>
      g.groupMembers?.some((m: any) => m.userId === user.id)
    );
    return NextResponse.json(userFullGroup || {});
  } catch (error) {
    console.error("Error fetching full groups for deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch full groups for deal" },
      { status: 500 }
    );
  }
}
