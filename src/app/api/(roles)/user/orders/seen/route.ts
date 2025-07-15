import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/server/user.actions";
import Order from "@/models/Order";

// PUT /api/user/orders - Update order fields (user side, e.g. accept/reject delivery)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    const order = await Order.findByPk(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // Only allow user to update their own order
    if (String(order.userId) !== String(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await order.update({ seen: true });

    return NextResponse.json({ message: "Order updated", order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
