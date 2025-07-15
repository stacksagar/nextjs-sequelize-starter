// Merchant-specific deal management endpoints

import { NextRequest, NextResponse } from "next/server";
import Deal, { DealStatus } from "@/models/Deal";
import { isAdmin } from "@/server/user.actions";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";

// GET /api/merchant/deals - List merchant's deals
export async function GET(req: NextRequest) {
  const user = await isAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const deal = await Deal.findByPk(id, {
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
    if (!deal)
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    // Remove merchantId check since it's not in the model
    return NextResponse.json({ item: deal });
  }
  // Support filtering by status, type, etc.
  const where: any = {};
  if (searchParams.get("status")) where.status = searchParams.get("status");
  if (searchParams.get("type")) where.type = searchParams.get("type");
  const deals = await Deal.findAll({
    where,
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
  return NextResponse.json({ items: deals });
}

// POST /api/merchant/deals - Create a new deal (merchant only)
export async function POST(req: NextRequest) {
  const user = await isAdmin();

  const body = await req.json();
  // Only title is required
  if (!body.title) {
    return NextResponse.json({ error: `title is required` }, { status: 400 });
  }
  // Create deal with all fields from Deal.ts
  const deal = await Deal.create({
    title: body.title,
    pricePerPerson:
      body.pricePerPerson !== undefined
        ? Number(body.pricePerPerson)
        : undefined,
    discountPrice:
      body.discountPrice !== undefined ? Number(body.discountPrice) : undefined,
    discountType: body.discountType,
    discountPercentage:
      body.discountPercentage !== undefined
        ? Number(body.discountPercentage)
        : undefined,
    requiredMembers:
      body.requiredMembers !== undefined
        ? Number(body.requiredMembers)
        : undefined,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
    redemptionLimit:
      body.redemptionLimit !== undefined
        ? Number(body.redemptionLimit)
        : undefined,
    images: body.images || [],
    videoUrl: body.videoUrl || "",
    category: body.category,
    tags: Array.isArray(body.tags) ? body.tags : [],
    status:
      body.status?.toLowerCase() === "draft"
        ? DealStatus.DRAFT
        : DealStatus.pending,
    location: body.location,
    merchantId: user.id,
    type: body.type,
    requiresRedemptionCard: body.requiresRedemptionCard, 
  });
  return NextResponse.json(deal, { status: 201 });
}

// PATCH /api/merchant/deals?id=... - Update merchant's own deal
export async function PATCH(req: NextRequest) {
  await isAdmin();

  const body = await req.json();
  const id = body.id || body.dealId;
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  const deal = await Deal.findByPk(id, {
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
  if (!deal)
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  // Remove merchantId check since it's not in the model
  // Only allow update if deal is draft or pending
  if (!deal.status || !["draft", "pending"].includes(deal.status)) {
    return NextResponse.json(
      { error: "Cannot update deal in this status" },
      { status: 400 }
    );
  }
  await deal.update(body);
  return NextResponse.json(deal);
}

// DELETE /api/merchant/deals?id=... - Delete merchant's own deal
export async function DELETE(req: NextRequest) {
  await isAdmin();
  const body = await req.json();
  const id = body?.id || body?.dealId;
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  const deal = await Deal.findByPk(id, {
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
  if (!deal)
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  // Remove merchantId check since it's not in the model
  await deal.destroy();
  return NextResponse.json({ success: true });
}
