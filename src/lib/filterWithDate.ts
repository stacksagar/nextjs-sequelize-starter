// filterWithDate.ts

export function filterAllTime<T extends { createdAt: Date }>(orders: T[]): T[] {
  return orders;
}

export function filterToday<T extends { createdAt: Date }>(orders: T[]): T[] {
  const today = new Date();
  return orders.filter((order) => {
    const created = new Date(order.createdAt);
    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  });
}

export function filterThisWeek<T extends { createdAt: Date }>(
  orders: T[]
): T[] {
  const now = new Date();
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  firstDayOfWeek.setHours(0, 0, 0, 0);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);
  return orders.filter((order) => {
    const created = new Date(order.createdAt);
    return created >= firstDayOfWeek && created <= lastDayOfWeek;
  });
}

export function filterThisMonth<T extends { createdAt: Date }>(
  orders: T[]
): T[] {
  const now = new Date();
  return orders.filter((order) => {
    const created = new Date(order.createdAt);
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth()
    );
  });
}

export function filterThisYear<T extends { createdAt: Date }>(
  orders: T[]
): T[] {
  const now = new Date();
  return orders.filter((order) => {
    const created = new Date(order.createdAt);
    return created.getFullYear() === now.getFullYear();
  });
}
