// Merchant-specific deal management endpoints

import { NextRequest, NextResponse } from "next/server";
import Deal, { DealStatus } from "@/models/Deal";
import { isMerchant } from "@/server/user.actions";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";

// GET /api/merchant/deals - List merchant's deals
export async function GET(req: NextRequest) {
  const user = await isMerchant();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const deal = await Deal.findOne({
      where: { id, merchantId: user.id },
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
  const where: any = {
    merchantId: user.id,
  };

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
  const user = await isMerchant();

  const body = await req.json();
  // Only title is required
  if (!body.title) {
    return NextResponse.json({ error: `title is required` }, { status: 400 });
  }
  // Create deal with all fields from the updated MerchantCreateDealForm
  const deal = await Deal.create({
    title: body.title,
    pricePerPerson:
      body.pricePerPerson !== undefined
        ? Number(body.pricePerPerson)
        : undefined,
    discountPrice:
      body.discountPrice !== undefined ? Number(body.discountPrice) : undefined,
    deliveryFee:
      body.deliveryFee !== undefined ? Number(body.deliveryFee) : undefined,

    discountPercentage:
      body.discountPercentage !== undefined
        ? Number(body.discountPercentage)
        : undefined,
    requiredMembers:
      body.requiredMembers !== undefined
        ? Number(body.requiredMembers)
        : undefined,
    description: body.description || undefined,
    redemptionExpired: body.redemptionExpired || undefined,
    endDate: body.endDate || undefined,
    images: Array.isArray(body.images) ? body.images : [],
    videoUrl: body.videoUrl || undefined,
    category: body.category || undefined,
    tags: Array.isArray(body.tags) ? body.tags : [],
    status:
      body.status?.toLowerCase() === "draft"
        ? DealStatus.DRAFT
        : DealStatus.pending,
    location: body.location || undefined,
    type: body.type,
    merchantId: user.id,
  });
  return NextResponse.json(deal, { status: 201 });
}

// PATCH /api/merchant/deals?id=... - Update merchant's own deal
export async function PATCH(req: NextRequest) {
  const user = await isMerchant();

  const body = await req.json();
  const id = body.id || body.dealId;
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  const deal = await Deal.findOne({
    where: { id, merchantId: user?.id },
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
  if (body?.status === "active" || body?.status === "completed") {
    return NextResponse.json(
      { error: "Cannot update deal in this status" },
      { status: 400 }
    );
  }

  // Prepare update data with proper type conversions
  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.pricePerPerson !== undefined)
    updateData.pricePerPerson = Number(body.pricePerPerson);
  if (body.requiredMembers !== undefined)
    updateData.requiredMembers = Number(body.requiredMembers);
  if (body.deliveryFee !== undefined)
    updateData.deliveryFee = Number(body.deliveryFee);
  if (body.discountPercentage !== undefined)
    updateData.discountPercentage = Number(body.discountPercentage);
  if (body.redemptionExpired !== undefined)
    updateData.redemptionExpired = body.redemptionExpired;
  if (body.endDate !== undefined) updateData.endDate = body.endDate;

  await deal.update(updateData);
  return NextResponse.json(deal);
}

// DELETE /api/merchant/deals?id=... - Delete merchant's own deal
export async function DELETE(req: NextRequest) {
  const user = await isMerchant();
  const body = await req.json();
  const id = body?.id || body?.dealId;
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const deal = await Deal.findOne({
    where: { id, merchantId: user?.id },
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
