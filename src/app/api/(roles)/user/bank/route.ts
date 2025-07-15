import { getUser } from "@/server/user.actions";
import Bank from "@/models/Bank";
import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await getUser();
    await connectDB();
    const banks = await Bank.findAll();
    return NextResponse.json(banks);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    await connectDB();
    const data = await req.json();
    const bank = await Bank.create({ ...data, userId: user?.id });
    return NextResponse.json(bank);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await getUser();
    await connectDB();
    const data = await req.json();
    const { id, ...update } = data;
    const bank = await Bank.findByPk(id);
    if (!bank) return new NextResponse("Bank not found", { status: 404 });
    await bank.update(update);
    return NextResponse.json(bank);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await getUser();
    await connectDB();
    const { id } = await req.json();
    const bank = await Bank.findByPk(id);
    if (!bank) return new NextResponse("Bank not found", { status: 404 });
    await bank.destroy();
    return NextResponse.json({ id });
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}
