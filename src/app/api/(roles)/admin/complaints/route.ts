// Placeholder for admin-only complaints management endpoints

import { NextRequest, NextResponse } from "next/server";
import Complaint from "@/models/Complaint";
import { ComplaintStatus } from "@/types/complaint";
import { getSessionUser } from "@/utils/auth";

// GET /api/admin/complaints - List all complaints
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const complaint = await Complaint.findByPk(id);
    if (!complaint)
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    return NextResponse.json({ item: complaint });
  }
  // Support filtering by status, userId, merchantId, etc.
  const where: any = {};
  if (searchParams.get("status")) where.status = searchParams.get("status");
  if (searchParams.get("userId")) where.userId = searchParams.get("userId");
  if (searchParams.get("merchantId"))
    where.merchantId = searchParams.get("merchantId");
  const complaints = await Complaint.findAll({ where });
  return NextResponse.json({ items: complaints });
}

// PATCH /api/admin/complaints?id=... - Update any complaint
export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  const complaint = await Complaint.findByPk(id);
  if (!complaint)
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
  const body = await req.json();
  await complaint.update(body);
  return NextResponse.json(complaint);
}

// DELETE /api/admin/complaints?id=... - Delete any complaint
export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  const complaint = await Complaint.findByPk(id);
  if (!complaint)
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
  await complaint.destroy();
  return NextResponse.json({ success: true });
}
