import { NextRequest, NextResponse } from "next/server";
import { getUser, isMerchant } from "@/server/user.actions";
import Voucher from "@/models/Voucher";
import { z } from "zod";

// Validation schema for voucher creation/update
const voucherSchema = z.object({
  dealId: z.string().uuid("Invalid deal ID"),

  title: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  validUntil: z.string().optional(),
  deliveryMethod: z.enum(["email", "sms", "in_app"]).optional(),
});

// GET /api/merchant/vouchers
export async function GET(req: NextRequest) {
  try {
    const merchant = await isMerchant();
    const vouchers = await Voucher.findAll({
      where: {
        userId: merchant.id,
      },
      include: ["deal"],
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(vouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch vouchers",
      },
      {
        status:
          error instanceof Error && error.message === "Access denied"
            ? 403
            : 500,
      }
    );
  }
}

// POST /api/merchant/vouchers
export async function POST(req: NextRequest) {
  try {
    const merchant = await isMerchant();
    const body = await req.json();
    const validatedData = voucherSchema.parse(body);

    const voucher = await Voucher.create({
      ...validatedData,
      userId: merchant.id,
      status: "active",
    });

    return NextResponse.json(voucher, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating voucher:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create voucher",
      },
      {
        status:
          error instanceof Error && error.message === "Access denied"
            ? 403
            : 500,
      }
    );
  }
}

// PUT /api/merchant/vouchers
export async function PUT(req: NextRequest) {
  try {
    const merchant = await isMerchant();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Voucher ID is required" },
        { status: 400 }
      );
    }

    const validatedData = voucherSchema.parse(updateData);

    const voucher = await Voucher.findOne({
      where: {
        id,
        userId: merchant.id,
      },
    });

    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    await voucher.update(validatedData);
    return NextResponse.json(voucher);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating voucher:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update voucher",
      },
      {
        status:
          error instanceof Error && error.message === "Access denied"
            ? 403
            : 500,
      }
    );
  }
}

// DELETE /api/merchant/vouchers
export async function DELETE(req: NextRequest) {
  try {
    const merchant = await isMerchant();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Voucher ID is required" },
        { status: 400 }
      );
    }

    const voucher = await Voucher.findOne({
      where: {
        id,
        userId: merchant.id,
      },
    });

    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    await voucher.destroy();
    return NextResponse.json({ message: "Voucher deleted successfully" });
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete voucher",
      },
      {
        status:
          error instanceof Error && error.message === "Access denied"
            ? 403
            : 500,
      }
    );
  }
}

// PATCH /api/merchant/vouchers
export async function PATCH(req: NextRequest) {
  try {
    const merchant = await isMerchant();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Voucher ID is required" },
        { status: 400 }
      );
    }

    const voucher = await Voucher.findOne({
      where: {
        id,
        userId: merchant.id,
      },
    });

    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    // Only allow redeeming if status is 'active'
    if (voucher.status !== "active") {
      return NextResponse.json(
        { error: "Voucher is not active" },
        { status: 400 }
      );
    }

    await voucher.update({
      status: "used",
      redeemedAt: new Date(),
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.error("Error redeeming voucher:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to redeem voucher",
      },
      {
        status:
          error instanceof Error && error.message === "Access denied"
            ? 403
            : 500,
      }
    );
  }
}
