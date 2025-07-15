import { NextRequest, NextResponse } from "next/server";
import RedemptionRequest from "@/models/RedemptionRequest";
import { isAdmin } from "@/server/user.actions";
import Order from "@/models/Order";

// Get all redemption requests
export async function GET(req: NextRequest) {
  try {
    await isAdmin();
    const requests = await RedemptionRequest.findAll({
      include: [{ model: Order, as: "order" }],
      order: [["createdAt", "DESC"]],
    });
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch redemption requests" },
      { status: 500 }
    );
  }
}

// Create a new redemption request
export async function POST(req: NextRequest) {
  try {
    // Only admin or authenticated user can create, adjust as needed
    // await isAdmin(); // Uncomment if only admin can create
    const { orderId, userId, screenshotUrl, message } = await req.json();
    if (!orderId || !userId || !screenshotUrl) {
      return NextResponse.json(
        { error: "orderId, userId, and screenshotUrl are required" },
        { status: 400 }
      );
    }
    const redemptionReq = await RedemptionRequest.create({
      orderId,
      userId,
      screenshotUrl,
      message,
      status: "pending",
    });
    return NextResponse.json({
      message: "Redemption request created",
      redemptionReq,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create redemption request" },
      { status: 500 }
    );
  }
}

// Update redemption request status (approve/reject)
export async function PATCH(req: NextRequest) {
  try {
    await isAdmin();
    const { id, status } = await req.json();
    if (
      !id ||
      !["outForDelivery", "dispatch", "completed", "rejected"].includes(status)
    ) {
      return NextResponse.json(
        { error: "id and valid status are required" },
        { status: 400 }
      );
    }

    const request = await RedemptionRequest.findByPk(id);
    if (!request) {
      return NextResponse.json(
        { error: "Redemption request not found" },
        { status: 404 }
      );
    }
    await request.update({ status, reviewedAt: new Date() });
    return NextResponse.json({
      message: "Redemption request updated",
      request,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update redemption request" },
      { status: 500 }
    );
  }
}

// Update any field(s) of a redemption request by id
export async function PUT(req: NextRequest) {
  try {
    await isAdmin();
    const { id, ...updateData } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const request = await RedemptionRequest.findByPk(id);
    if (!request) {
      return NextResponse.json(
        { error: "Redemption request not found" },
        { status: 404 }
      );
    }
    await request.update(updateData);
    return NextResponse.json({
      message: "Redemption request updated",
      request,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update redemption request" },
      { status: 500 }
    );
  }
}
