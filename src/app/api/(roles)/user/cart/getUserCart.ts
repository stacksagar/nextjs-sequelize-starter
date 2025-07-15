import Cart from "@/models/Cart";
import Deal from "@/models/Deal";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";
import { getUser } from "@/server/user.actions";
import { ArrayParser, ObjectParser } from "@/utils/JSON.parser";

export async function getUserCart() {
  const user = await getUser();
  if (!user?.id) return { cart: null, items: [], deals: [] };

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
  const productIds = Array.isArray(items)
    ? items.map((item: any) => item.productId)
    : [];

  const deals = productIds.length
    ? await Deal.findAll({
        where: { id: productIds },
        include: [
          {
            model: Group,
            as: "groups",
            include: [
              {
                model: GroupMember,
                as: "groupMembers",
              },
            ],
            order: [["createdAt", "DESC"]],
          },
        ],
      })
    : [];

  const populatedItems = Array.isArray(items)
    ? items.map((item: any) => {
        const deal = deals.find((d: any) => d.id === item.productId);
        return { ...item, deal };
      })
    : [];
  return {
    cart: ObjectParser(cart),
    items: ArrayParser(populatedItems),
    deals: ArrayParser(deals),
  };
}
