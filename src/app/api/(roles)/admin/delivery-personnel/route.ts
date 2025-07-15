import { NextRequest, NextResponse } from "next/server";
import DeliveryPersonnel from "@/models/DeliveryPersonnel";
import { isAdmin } from "@/server/user.actions";

// Update Delivery Personnel
export async function PUT(req: NextRequest) {
  try {
    await isAdmin();
    const { id, name, phone, email, vehicle, bank, account, paymentPref } =
      await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const personnel = await DeliveryPersonnel.findByPk(id);
    if (!personnel) {
      return NextResponse.json(
        { error: "Personnel not found" },
        { status: 404 }
      );
    }
    // Only update fields that are provided (not undefined)
    if (typeof name !== "undefined") personnel.name = name;
    if (typeof phone !== "undefined") personnel.phone = phone;
    if (typeof email !== "undefined") personnel.email = email;
    if (typeof vehicle !== "undefined") personnel.vehicle = vehicle;
    if (typeof bank !== "undefined") personnel.bank = bank;
    if (typeof account !== "undefined") personnel.account = account;
    if (typeof paymentPref !== "undefined") personnel.paymentPref = paymentPref;
    await personnel.save();
    return NextResponse.json({ message: "Personnel updated", personnel });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update personnel" },
      { status: 500 }
    );
  }
}

// Create Delivery Personnel
export async function POST(req: NextRequest) {
  try {
    await isAdmin();
    const { name, phone, email, vehicle, bank, account, paymentPref } =
      await req.json();
    if (!name || !phone || !email || !vehicle || !bank || !account) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const isExisting = await DeliveryPersonnel.findOne({
      where: { email },
    });

    if (isExisting) {
      return NextResponse.json(
        { error: "Delivery personnel with this email already exists" },
        { status: 400 }
      );
    }

    const deliveryPersonnel = await DeliveryPersonnel.create({
      name,
      phone,
      email,
      vehicle,
      bank,
      account,
      paymentPref: paymentPref || "Bank Transfer",
    });
    return NextResponse.json({
      message: "Delivery personnel created",
      deliveryPersonnel,
    });
  } catch (error) {
    console.log("ERROR IS:: ", error);
    return NextResponse.json(
      { error: "Failed to create delivery personnel" },
      { status: 500 }
    );
  }
}

// List all Delivery Personnel
export async function GET() {
  try {
    await isAdmin();
    const personnel = await DeliveryPersonnel.findAll();
    return NextResponse.json({ personnel });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch delivery personnel" },
      { status: 500 }
    );
  }
}
