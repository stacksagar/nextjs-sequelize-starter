import { sendEmail } from "@/lib/sendEmail";
import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/Group";
import { getUser } from "@/server/user.actions";
import Order from "@/models/Order";
import Deal from "@/models/Deal";
import User from "@/models/User";
import ChatGroup from "@/models/ChatGroup";
import { createChatGroupMembersWithAdmins } from "@/lib/chatHelpers";

// PUT /api/user/orders - Update order fields (user side, e.g. accept/reject delivery)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "user" },
        { model: Deal, as: "deal", include: [{ model: User, as: "merchant" }] },
        {
          model: Group,
          as: "group",
          include: [{ model: Order, as: "orders" }],
        },
      ],
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // Only allow user to update their own order
    if (String(order.userId) !== String(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await order.update({ status });

    if (status === "rejected") {
      const chatGroup = await ChatGroup.create({
        name: `Refund Req - for ${order?.deal?.title}`,
        userId: user.id,
        orderId: order?.id,
      });

      // Create ChatGroupMember for merchant, user, and all admins
      await createChatGroupMembersWithAdmins(chatGroup.id, [user?.id]);
    }

    // If status is fulfilled, move amount from merchant.book_balance to merchant.available_balance
    if (status === "fulfilled" && order.deal && order.deal.merchant) {
      const merchantUser = order.deal.merchant;
      // Defensive: ensure balances are numbers
      const book_balance = Number(merchantUser.book_balance || 0);
      const available_balance = Number(merchantUser.available_balance || 0);
      const amount = Number(order.amount || 0);
      // Deduct from book_balance, add to available_balance
      await merchantUser.update({
        book_balance: book_balance - amount,
        available_balance: available_balance + amount,
      });
    }

    // If status is fulfilled, check if all orders in group are fulfilled
    if (status === "fulfilled" && order.groupId) {
      const group = await Group.findByPk(order.groupId, {
        include: ["orders"],
      });

      console.log("group id:::", group?.id);
      console.log("group orders:::", group?.orders?.length);

      if (group && group.orders && Array.isArray(group.orders)) {
        // Check if all orders are fulfilled (including this one)
        const allFulfilled = group.orders.every(
          (o: any) => (o.id === order.id ? status : o.status) === "fulfilled"
        );
        if (allFulfilled) {
          await group.update({ status: "completed" });
        }
      }
    }

    // If status is fulfilled or refund-requested, send email to merchant
    if (
      (status === "fulfilled" || status === "refund-requested") &&
      order.deal &&
      order.deal.merchant &&
      order.deal.merchant.email
    ) {
      try {
        const merchant = order.deal.merchant;
        const deal = order.deal;
        const group = order.group;
        const statusText = status === "fulfilled" ? "Accepted" : "Rejected";
        const body = `
          <h2>Order ${statusText} by User</h2>
          <p>User <b>${
            user.name || user.email
          }</b> has <b>${statusText.toLowerCase()}</b> the delivery for deal <b>${
          deal?.title || "Deal"
        }</b>.</p>
          <ul>
            <li><b>Order ID:</b> ${order.id}</li>
            <li><b>Deal:</b> ${deal?.title || "-"}</li>
            <li><b>Group:</b> ${group?.id || "-"}</li>
            <li><b>Amount:</b> ₦${order.amount}</li>
            <li><b>Status:</b> ${statusText}</li>
          </ul>
          <p>Check your merchant dashboard for more details.</p>
        `;
        await sendEmail({
          to: merchant.email,
          subject: `Order ${statusText} by User (${deal?.title || "Deal"})`,
          body,
        });
      } catch (e) {
        console.error("Failed to send merchant notification email", e);
      }
    }
    return NextResponse.json({ message: "Order updated", order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// PUT /api/user/orders - Update order fields (user side, e.g. accept/reject delivery)
export async function PUT(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, ...body } = await req.json();

    const order = await Order.findByPk(orderId, {
      include: [{ model: Deal, as: "deal" }],
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (String(order.userId) !== String(user.id)) {
      // Only allow user to update their own order
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await order.update(body || {});

    return NextResponse.json({ message: "Order updated", order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// GET /api/user/group - List user's groups or get a specific group
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      // Get a specific group
      const order = await Group.findByPk(orderId, {});

      if (!order) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }

      return NextResponse.json(order);
    } else {
      const orders = await Order.findAll({ where: { userId: user.id } });

      return NextResponse.json({ items: orders });
    }
  } catch (error) {
    console.error("Error fetching group(s):", error);
    return NextResponse.json(
      { error: "Failed to fetch group(s)" },
      { status: 500 }
    );
  }
}
