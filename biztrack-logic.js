function normalizeProductId(value) {
  const raw = String(value ?? "").trim();

  if (!/^\d+$/.test(raw)) return null;

  const number = Number(raw);
  if (!Number.isInteger(number) || number <= 0) return null;

  return `PD${String(number).padStart(3, "0")}`;
}

function normalizeInventoryId(existingItems = []) {
  const maxId = existingItems.reduce((max, item) => {
    const match = String(item.inventoryID || "").match(/^INV(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `INV${String(maxId + 1).padStart(3, "0")}`;
}

function calculateInventoryStatus(stockQuantity, reorderLevel) {
  const stock = Number(stockQuantity);
  const reorder = Number(reorderLevel);

  if (!Number.isFinite(stock) || stock < 0) return null;
  if (!Number.isFinite(reorder) || reorder < 0) return null;

  if (stock === 0) return "Out of Stock";
  if (stock <= reorder) return "Low Stock";
  return "In Stock";
}

function getInventoryAlertCounts(inventory = []) {
  return inventory.reduce(
    (summary, item) => {
      const status = item.status || calculateInventoryStatus(item.stockQuantity, item.reorderLevel);

      summary.total += 1;

      if (status === "In Stock") summary.inStock += 1;
      else if (status === "Low Stock") summary.lowStock += 1;
      else if (status === "Out of Stock") summary.outOfStock += 1;

      return summary;
    },
    { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 }
  );
}

function shouldApplyInventory(orderStatus) {
  return orderStatus === "Shipped" || orderStatus === "Delivered";
}

function calculateOrderTotal(itemPrice, quantity, shipping = 0, taxes = 0) {
  const price = Number(itemPrice);
  const qty = Number(quantity);
  const ship = Number(shipping);
  const tax = Number(taxes);

  if (![price, qty, ship, tax].every(Number.isFinite)) return null;
  if (price < 0 || qty <= 0 || !Number.isInteger(qty) || ship < 0 || tax < 0) return null;

  return Number((price * qty + ship + tax).toFixed(2));
}

function getOrderStatusCounts(orders = []) {
  return orders.reduce(
    (summary, order) => {
      if (order.orderStatus === "Pending") summary.pending += 1;
      if (order.orderStatus === "Processing") summary.processing += 1;
      if (order.orderStatus === "Shipped") summary.shipped += 1;
      if (order.orderStatus === "Delivered") summary.delivered += 1;
      return summary;
    },
    { pending: 0, processing: 0, shipped: 0, delivered: 0 }
  );
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  const formulaStart = /^[=+\-@]/.test(text);
  const escaped = formulaStart ? `'${text}` : text;

  if (/[",\n\r]/.test(escaped)) {
    return `"${escaped.replace(/"/g, '""')}"`;
  }

  return escaped;
}

function calculateDashboardSummary(products = [], orders = [], expenses = []) {
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  return {
    revenue: Number(revenue.toFixed(2)),
    expenses: Number(expenseTotal.toFixed(2)),
    balance: Number((revenue - expenseTotal).toFixed(2)),
    productCount: products.length,
    orderCount: orders.length
  };
}

function parseStoredArray(raw, fallback = []) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

module.exports = {
  normalizeProductId,
  normalizeInventoryId,
  calculateInventoryStatus,
  getInventoryAlertCounts,
  shouldApplyInventory,
  calculateOrderTotal,
  getOrderStatusCounts,
  escapeCsvValue,
  calculateDashboardSummary,
  parseStoredArray
};