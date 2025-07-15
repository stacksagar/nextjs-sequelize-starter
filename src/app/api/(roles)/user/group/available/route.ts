import { NextRequest, NextResponse } from "next/server";
import Group, { GroupStatus } from "@/models/Group";
import User from "@/models/User";
import GroupMember from "@/models/GroupMember";
import Deal from "@/models/Deal";

// GET /api/user/group - List user's groups or get a specific group
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get("dealId");
    if (!dealId) {
      return NextResponse.json(
        { error: "dealId is required" },
        { status: 400 }
      );
    }

    const items = await Group.findAll({
      where: { dealId, status: GroupStatus.OPEN },
      include: [
        { model: GroupMember, as: "groupMembers" },
        { model: Deal, as: "deal" },
      ],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching group(s):", error);
    return NextResponse.json(
      { error: "Failed to fetch group(s)" },
      { status: 500 }
    );
  }
}
