import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { isUser } from "@/server/user.actions";
import { getUserCart } from "./getUserCart";

// GET: Get user's cart with populated deal info
export async function GET(_req: NextRequest) {
  const { cart, items, deals } = await getUserCart();
  return NextResponse.json({
    cart,
    items,
    deals,
  });
}

// POST: Add or update an item in the cart
export async function POST(req: NextRequest) {
  const user = await isUser();
  const { productId, quantity, price } = await req.json();
  if (!productId || !quantity) {
    return NextResponse.json(
      { error: "productId and quantity are required" },
      { status: 400 }
    );
  }
  let cart = await Cart.findOne({ where: { userId: user.id } });
  if (!cart) {
    cart = await Cart.create({ userId: user.id, items: [] });
  }
  let items = cart.items || [];
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }
  const existingIndex = Array.isArray(items)
    ? items.findIndex((item: any) => item?.productId === productId)
    : -1;
  if (existingIndex > -1) {
    // Update quantity and price
    items[existingIndex].quantity = quantity;
    if (price !== undefined) items[existingIndex].price = price;
  } else {
    items.push({ productId, quantity, price });
  }
  cart.items = items;
  await cart.save();
  return NextResponse.json(cart);
}

// DELETE: Remove an item from the cart
export async function DELETE(req: NextRequest) {
  const user = await isUser();
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }
  let cart = await Cart.findOne({ where: { userId: user.id } });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }
  let items = cart.items || [];
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }
  cart.items = Array.isArray(items)
    ? items.filter((item: any) => item.productId !== productId)
    : [];
  await cart.save();
  return NextResponse.json(cart);
}
