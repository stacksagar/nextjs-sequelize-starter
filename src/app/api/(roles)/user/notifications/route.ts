import Notification from "@/models/Notification";
import { getUser } from "@/server/user.actions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await getUser();

    const notifications = await Notification.findAll({
      where: { userId: user?.id },
      order: [["createdAt", "DESC"]], // Sort by latest
    });

    return NextResponse.json({
      items: notifications,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const notifications = await Notification.destroy({
      where: { id, userId: user?.id },
    });

    return NextResponse.json({
      items: notifications,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
