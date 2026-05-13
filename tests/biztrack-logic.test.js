const {
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
} = require("../biztrack-logic");

describe("product and inventory helpers", () => {
  test("normalizes product IDs", () => {
    expect(normalizeProductId("6")).toBe("PD006");
    expect(normalizeProductId("001")).toBe("PD001");
    expect(normalizeProductId("0")).toBeNull();
    expect(normalizeProductId("-1")).toBeNull();
    expect(normalizeProductId("abc")).toBeNull();
  });

  test("generates next inventory ID", () => {
    expect(normalizeInventoryId([])).toBe("INV001");
    expect(normalizeInventoryId([{ inventoryID: "INV001" }, { inventoryID: "INV009" }])).toBe("INV010");
  });

  test("calculates inventory status", () => {
    expect(calculateInventoryStatus(0, 5)).toBe("Out of Stock");
    expect(calculateInventoryStatus(3, 5)).toBe("Low Stock");
    expect(calculateInventoryStatus(6, 5)).toBe("In Stock");
    expect(calculateInventoryStatus(-1, 5)).toBeNull();
    expect(calculateInventoryStatus(5, -1)).toBeNull();
  });

  test("counts inventory alerts", () => {
    const inventory = [
      { stockQuantity: 0, reorderLevel: 5 },
      { stockQuantity: 3, reorderLevel: 5 },
      { stockQuantity: 9, reorderLevel: 5 },
      { status: "In Stock" }
    ];

    expect(getInventoryAlertCounts(inventory)).toEqual({
      total: 4,
      inStock: 2,
      lowStock: 1,
      outOfStock: 1
    });
  });
});

describe("order helpers", () => {
  test("decides when inventory should be applied", () => {
    expect(shouldApplyInventory("Pending")).toBe(false);
    expect(shouldApplyInventory("Processing")).toBe(false);
    expect(shouldApplyInventory("Shipped")).toBe(true);
    expect(shouldApplyInventory("Delivered")).toBe(true);
  });

  test("calculates order total", () => {
    expect(calculateOrderTotal(10, 2, 3, 1.5)).toBe(24.5);
    expect(calculateOrderTotal("12.50", "2", "0.50", "1")).toBe(26.5);
    expect(calculateOrderTotal(10, 0, 0, 0)).toBeNull();
    expect(calculateOrderTotal(10, 1.5, 0, 0)).toBeNull();
    expect(calculateOrderTotal(10, 1, -1, 0)).toBeNull();
  });

  test("counts order statuses", () => {
    const orders = [
      { orderStatus: "Pending" },
      { orderStatus: "Processing" },
      { orderStatus: "Shipped" },
      { orderStatus: "Delivered" },
      { orderStatus: "Delivered" }
    ];

    expect(getOrderStatusCounts(orders)).toEqual({
      pending: 1,
      processing: 1,
      shipped: 1,
      delivered: 2
    });
  });
});

describe("csv and dashboard helpers", () => {
  test("escapes CSV values", () => {
    expect(escapeCsvValue("hello")).toBe("hello");
    expect(escapeCsvValue("a,b")).toBe('"a,b"');
    expect(escapeCsvValue('a"b')).toBe('"a""b"');
    expect(escapeCsvValue("line\nbreak")).toBe('"line\nbreak"');
    expect(escapeCsvValue("=SUM(A1:A2)")).toBe("'=SUM(A1:A2)");
  });

  test("calculates dashboard summary", () => {
    const products = [{}, {}];
    const orders = [{ total: 100 }, { total: "50.25" }];
    const expenses = [{ amount: 20 }, { amount: "5.25" }];

    expect(calculateDashboardSummary(products, orders, expenses)).toEqual({
      revenue: 150.25,
      expenses: 25.25,
      balance: 125,
      productCount: 2,
      orderCount: 2
    });
  });

  test("parses stored arrays safely", () => {
    expect(parseStoredArray("[1,2,3]", [])).toEqual([1, 2, 3]);
    expect(parseStoredArray('{"bad":true}', ["fallback"])).toEqual(["fallback"]);
    expect(parseStoredArray("not json", ["fallback"])).toEqual(["fallback"]);
  });
});
describe("additional branch coverage cases", () => {
  test("handles missing and unusual product id values", () => {
    expect(normalizeProductId(null)).toBeNull();
    expect(normalizeProductId(undefined)).toBeNull();
    expect(normalizeProductId(" 007 ")).toBe("PD007");
    expect(normalizeProductId("12.5")).toBeNull();
  });

  test("ignores invalid inventory IDs when generating next ID", () => {
    const items = [
      { inventoryID: "BAD001" },
      { inventoryID: "" },
      { inventoryID: "INV002" }
    ];

    expect(normalizeInventoryId(items)).toBe("INV003");
  });

  test("handles invalid inventory alert status safely", () => {
    const inventory = [
      { status: "Unknown" },
      { stockQuantity: "bad", reorderLevel: 5 },
      { stockQuantity: 2, reorderLevel: "bad" }
    ];

    expect(getInventoryAlertCounts(inventory)).toEqual({
      total: 3,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0
    });
  });

  test("handles invalid order total inputs", () => {
    expect(calculateOrderTotal("bad", 1, 0, 0)).toBeNull();
    expect(calculateOrderTotal(10, 1, "bad", 0)).toBeNull();
    expect(calculateOrderTotal(10, 1, 0, "bad")).toBeNull();
    expect(calculateOrderTotal(-10, 1, 0, 0)).toBeNull();
    expect(calculateOrderTotal(10, 1, 0, -1)).toBeNull();
  });

  test("escapes CSV formulas and quoted formulas", () => {
    expect(escapeCsvValue("+cmd")).toBe("'+cmd");
    expect(escapeCsvValue("-cmd")).toBe("'-cmd");
    expect(escapeCsvValue("@cmd")).toBe("'@cmd");
    expect(escapeCsvValue('=SUM("A1")')).toBe('"\'=SUM(""A1"")"');
    expect(escapeCsvValue(null)).toBe("");
  });

  test("dashboard summary handles missing totals and amounts", () => {
    const summary = calculateDashboardSummary(
      [{}],
      [{}, { total: "30.50" }],
      [{}, { amount: "10.25" }]
    );

    expect(summary).toEqual({
      revenue: 30.5,
      expenses: 10.25,
      balance: 20.25,
      productCount: 1,
      orderCount: 2
    });
  });

  test("parseStoredArray returns parsed arrays and fallback for invalid values", () => {
    const fallback = [{ demo: true }];

    expect(parseStoredArray("[]", fallback)).toEqual([]);
    expect(parseStoredArray("null", fallback)).toEqual(fallback);
    expect(parseStoredArray(undefined, fallback)).toEqual(fallback);
  });
});