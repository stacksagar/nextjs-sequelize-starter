import { getUser } from "@/server/user.actions";
import Card from "@/models/Card";
import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await getUser();
    await connectDB();
    const cards = await Card.findAll();
    return NextResponse.json(cards);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    await connectDB();
    const data = await req.json();
    const card = await Card.create({ ...data, userId: user?.id });
    return NextResponse.json(card);
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
    const card = await Card.findByPk(id);
    if (!card) return new NextResponse("Card not found", { status: 404 });
    await card.update(update);
    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await getUser();
    await connectDB();
    const { id } = await req.json();
    const card = await Card.findByPk(id);
    if (!card) return new NextResponse("Card not found", { status: 404 });
    await card.destroy();
    return NextResponse.json({ id });
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
}
