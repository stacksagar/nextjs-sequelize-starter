// Placeholder for admin-only complaints management endpoints

import { NextRequest, NextResponse } from "next/server";
import Complaint from "@/models/Complaint";
import { ComplaintStatus } from "@/types/complaint";
import { getSessionUser } from "@/utils/auth";

// PATCH /api/admin/complaints/resolve?id=... - Resolve a complaint
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
  if (complaint.status === ComplaintStatus.RESOLVED) {
    return NextResponse.json(
      { error: "Complaint is already resolved" },
      { status: 400 }
    );
  }
  const body = await req.json();
  if (!body.resolution) {
    return NextResponse.json(
      { error: "resolution is required" },
      { status: 400 }
    );
  }
  await complaint.update({
    status: ComplaintStatus.RESOLVED,
    resolution: body.resolution,
    resolvedAt: new Date(),
    resolvedBy: user.id,
  });
  return NextResponse.json(complaint);
}
