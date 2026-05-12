function getExpenseCategoryKey(category) {
  const categoryKeys = {
    "Rent": "rent",
    "Order Fulfillment": "orderFulfillment",
    "Utilities": "utilities",
    "Supplies": "supplies",
    "Miscellaneous": "miscellaneous"
  };

  return categoryKeys[category] || category;
}

function translateExpenseCategory(category) {
  const key = getExpenseCategoryKey(category);
  return getText(key);
}

function getProductCategoryKey(category) {
  const categoryKeys = {
    "Hats": "hats",
    "Drinkware": "drinkware",
    "Clothing": "clothing",
    "Accessories": "accessories",
    "Home decor": "homeDecor"
  };

  return categoryKeys[category] || category;
}

function translateProductCategory(category) {
  const key = getProductCategoryKey(category);
  return getText(key);
}

function getFallbackTransactions() {
  return [
    {
      trID: 1,
      trDate: "2024-01-05",
      trCategory: "Rent",
      trAmount: 100.00,
      trNotes: "January Rent"
    },
    {
      trID: 2,
      trDate: "2024-01-15",
      trCategory: "Order Fulfillment",
      trAmount: 35.00,
      trNotes: "Order #1005"
    },
    {
      trID: 3,
      trDate: "2024-01-08",
      trCategory: "Utilities",
      trAmount: 120.00,
      trNotes: "Internet"
    },
    {
      trID: 4,
      trDate: "2024-02-05",
      trCategory: "Supplies",
      trAmount: 180.00,
      trNotes: "Embroidery Machine"
    },
    {
      trID: 5,
      trDate: "2024-01-25",
      trCategory: "Miscellaneous",
      trAmount: 20.00,
      trNotes: "Pizza"
    },
  ];
}

function getFallbackOrders() {
  return [
    {
      orderID: "1001",
      orderDate: "2024-01-05",
      itemName: "Baseball caps",
      itemPrice: 25.00,
      qtyBought: 2,
      shipping: 2.50,
      taxes: 9.00,
      orderTotal: 61.50,
      orderStatus: "Pending"
    },
    {
      orderID: "1002",
      orderDate: "2024-03-05",
      itemName: "Water bottles",
      itemPrice: 17.00,
      qtyBought: 3,
      shipping: 3.50,
      taxes: 6.00,
      orderTotal: 60.50,
      orderStatus: "Processing"
    },
    {
      orderID: "1003",
      orderDate: "2024-02-05",
      itemName: "Tote bags",
      itemPrice: 20.00,
      qtyBought: 4,
      shipping: 2.50,
      taxes: 2.00,
      orderTotal: 84.50,
      orderStatus: "Shipped"
    },
    {
      orderID: "1004",
      orderDate: "2023-01-05",
      itemName: "Canvas prints",
      itemPrice: 55.00,
      qtyBought: 1,
      shipping: 2.50,
      taxes: 19.00,
      orderTotal: 76.50,
      orderStatus: "Delivered"
    },
    {
      orderID: "1005",
      orderDate: "2024-01-15",
      itemName: "Beanies",
      itemPrice: 15.00,
      qtyBought: 2,
      shipping: 3.90,
      taxes: 4.00,
      orderTotal: 37.90,
      orderStatus: "Pending"
    },
  ];
}

function getFallbackProducts() {
  return [
    {
      prodID: "PD001",
      prodName: "Baseball caps",
      prodDesc: "Peace embroidered cap",
      prodCat: "Hats",
      prodPrice: 25.00,
      prodSold: 20
    },
    {
      prodID: "PD002",
      prodName: "Water bottles",
      prodDesc: "Floral lotus printed bottle",
      prodCat: "Drinkware",
      prodPrice: 48.50,
      prodSold: 10
    },
    {
      prodID: "PD003",
      prodName: "Sweatshirt",
      prodDesc: "Palestine sweater",
      prodCat: "Clothing",
      prodPrice: 17.50,
      prodSold: 70
    },
    {
      prodID: "PD004",
      prodName: "Posters",
      prodDesc: "Vibes printed poster",
      prodCat: "Home decor",
      prodPrice: 12.00,
      prodSold: 60
    },
    {
      prodID: "PD005",
      prodName: "Pillow cases",
      prodDesc: "Morrocan print pillow case",
      prodCat: "Accessories",
      prodPrice: 17.00,
      prodSold: 40
    },
  ];
}

function getFallbackInventory() {
  return [];
}

function getStoredCollection(key, fallbackItems) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : fallbackItems;
}

function translateDisplayValue(value) {
  if (typeof value !== "string") {
    return String(value ?? "");
  }

  if (typeof getText === "function") {
    const translated = getText(value);
    return translated || value;
  }

  return value;
}

function createWorkspaceEntry(label, value) {
  const item = document.createElement("li");
  const labelSpan = document.createElement("strong");
  const valueSpan = document.createElement("span");

  labelSpan.textContent = `${label}: `;
  valueSpan.textContent = value;

  item.append(labelSpan, valueSpan);
  return item;
}

function renderRecentActivity() {
  const list = document.getElementById("recent-activity-list");
  if (!list) {
    return;
  }

  const products = getStoredCollection("bizTrackProducts", getFallbackProducts());
  const orders = getStoredCollection("bizTrackOrders", getFallbackOrders());
  const expenses = getStoredCollection("bizTrackTransactions", getFallbackTransactions());

  list.replaceChildren();

  const latestProduct = products.at(-1);
  const latestOrder = orders.at(-1);
  const latestExpense = expenses.at(-1);

  const productText = latestProduct
    ? `${latestProduct.prodID} ${translateDisplayValue(latestProduct.prodName)}`
    : getText("noProductsYet");
  const orderText = latestOrder
    ? `#${latestOrder.orderID} ${translateDisplayValue(latestOrder.itemName)}`
    : getText("noOrdersYet");
  const expenseText = latestExpense
    ? `${latestExpense.trNotes} $${Number(latestExpense.trAmount).toFixed(2)}`
    : getText("noExpensesYet");

  list.append(
    createWorkspaceEntry(getText("latestProduct"), productText),
    createWorkspaceEntry(getText("latestOrder"), orderText),
    createWorkspaceEntry(getText("latestExpense"), expenseText)
  );
}

function createStatusOverviewItem(statusKey, value) {
  const item = document.createElement("div");
  const label = document.createElement("span");
  const count = document.createElement("span");
  const statusClassMap = {
    totalInventoryItems: "inventory-total",
    inStock: "in-stock",
    lowStock: "low-stock",
    outOfStock: "out-of-stock",
  };

  item.className = `status-overview-item ${statusClassMap[statusKey] || statusKey}`;
  label.className = "status-overview-label";
  count.className = "status-overview-value";

  label.textContent = getText(statusKey);
  count.textContent = String(value);

  item.append(label, count);
  return item;
}

function createStatusOverviewEmptyState(message) {
  const emptyState = document.createElement("div");
  emptyState.className = "status-overview-empty";
  emptyState.textContent = message;
  return emptyState;
}

function renderOrderStatusOverview() {
  const overview = document.getElementById("order-status-overview");
  if (!overview) {
    return;
  }

  const orders = getStoredCollection("bizTrackOrders", getFallbackOrders());
  const counts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  };

  orders.forEach(order => {
    const normalizedStatus = String(order.orderStatus || "").trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(counts, normalizedStatus)) {
      counts[normalizedStatus] += 1;
    }
  });

  overview.replaceChildren(
    createStatusOverviewItem("pending", counts.pending),
    createStatusOverviewItem("processing", counts.processing),
    createStatusOverviewItem("shipped", counts.shipped),
    createStatusOverviewItem("delivered", counts.delivered)
  );
}

function renderInventoryAlertsOverview() {
  const overview = document.getElementById("inventory-alerts-overview");
  if (!overview) {
    return;
  }

  const inventoryItems = getStoredCollection("bizTrackInventory", getFallbackInventory());

  if (!inventoryItems.length) {
    overview.replaceChildren(createStatusOverviewEmptyState(getText("noInventoryYet")));
    return;
  }

  const counts = {
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  };

  inventoryItems.forEach((item) => {
    const stockQuantity = Number(item.stockQuantity) || 0;
    const reorderLevel = Number(item.reorderLevel) || 0;
    let normalizedStatus = "In Stock";

    if (stockQuantity === 0) {
      normalizedStatus = "Out of Stock";
    } else if (stockQuantity <= reorderLevel) {
      normalizedStatus = "Low Stock";
    }

    if (normalizedStatus === "In Stock") {
      counts.inStock += 1;
      return;
    }

    if (normalizedStatus === "Low Stock") {
      counts.lowStock += 1;
      return;
    }

    if (normalizedStatus === "Out of Stock") {
      counts.outOfStock += 1;
    }
  });

  overview.replaceChildren(
    createStatusOverviewItem("totalInventoryItems", inventoryItems.length),
    createStatusOverviewItem("inStock", counts.inStock),
    createStatusOverviewItem("lowStock", counts.lowStock),
    createStatusOverviewItem("outOfStock", counts.outOfStock)
  );
}

function renderDashboardWorkspace() {
  renderRecentActivity();
  renderOrderStatusOverview();
  renderInventoryAlertsOverview();
}

function refreshDashboard() {
  renderDashboardSummary();
  renderDashboardWorkspace();
  initializeChart();
}

function renderDashboardSummary() {
  const expenses = getStoredCollection("bizTrackTransactions", getFallbackTransactions());
  const revenues = getStoredCollection("bizTrackOrders", getFallbackOrders());

  const totalExpenses = calculateExpTotal(expenses);
  const totalRevenues = calculateRevTotal(revenues);
  const totalBalance = totalRevenues - totalExpenses;
  const numOrders = revenues.length;

  const revDiv = document.getElementById('rev-amount');
  const expDiv = document.getElementById('exp-amount');
  const balDiv = document.getElementById('balance');
  const ordDiv = document.getElementById('num-orders');

  revDiv.innerHTML = `
      <span class="title">${getText("revenue")}</span>
      <span class="amount-value">$${totalRevenues.toFixed(2)}</span> 
  `;

  expDiv.innerHTML = `
    <span class="title">${getText("expenses")}</span>
    <span class="amount-value">$${totalExpenses.toFixed(2)}</span>
  `;

  balDiv.innerHTML = `
    <span class="title">${getText("balance")}</span>
    <span class="amount-value">$${totalBalance.toFixed(2)}</span>
  `;

  ordDiv.innerHTML = `
    <span class="title">${getText("ordersCount")}</span>
    <span class="amount-value">${numOrders}</span>
  `;
}

function calculateExpTotal(transactions) {
  return transactions.reduce((total, transaction) => total + transaction.trAmount, 0);
}
function calculateRevTotal(orders) {
  return orders.reduce((total, order) => total + order.orderTotal, 0);
}


// ---------- CHARTS ----------
let barChartInstance = null;
let donutChartInstance = null;

// BAR CHART

function calculateCategorySales(products) {
  const categorySales = {};

  products.forEach(product => {
    const category = product.prodCat;

    if (!categorySales[category]) {
      categorySales[category] = 0;
    }

    categorySales[category] += product.prodPrice * product.prodSold;
  });

  return categorySales;
}


function initializeChart() {
  const items = getStoredCollection("bizTrackProducts", getFallbackProducts());
  const categorySalesData = calculateCategorySales(items);

  const sortedCategorySales = Object.entries(categorySalesData)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const barChartOptions = {
      series: [{
          name: getText("totalSales"),
          data: Object.values(sortedCategorySales),
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {show: false},
      },
      theme: {
        palette: 'palette9' // upto palette10
      },
      // colors: ['#247BA0', '#A37A74', '#249672', '#e49273', '#9AADBF'],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 3,
          horizontal: false,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 0.7,
      },
      xaxis: {
        categories: Object.keys(sortedCategorySales).map(category => translateProductCategory(category)),
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: getText("totalSalesDollars"),
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$' + val.toFixed(2);
          }
        }
      }
    };
    
  if (barChartInstance) {
    barChartInstance.destroy();
  }

  barChartInstance = new ApexCharts(
    document.querySelector('#bar-chart'), barChartOptions
  );
  barChartInstance.render();


  // DONUT CHART

  function calculateCategoryExp(transactions) {
    const categoryExpenses = {};

    transactions.forEach(transaction => {
      const category = transaction.trCategory;

      if (!categoryExpenses[category]) {
        categoryExpenses[category] = 0;
      }

      categoryExpenses[category] += transaction.trAmount;
    });

    return categoryExpenses;
  }

  const expItems = getStoredCollection("bizTrackTransactions", getFallbackTransactions());
  const categoryExpData = calculateCategoryExp(expItems);

  const donutChartOptions = {
    series: Object.values(categoryExpData),
    labels: Object.keys(categoryExpData).map(category => translateExpenseCategory(category)),
    chart: {
      // height: 350,
      type: 'donut',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    theme: {
      palette: 'palette1' // upto palette10
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Loto, sans-serif',
        fontWeight: 'regular',
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        donut: {
          size: '60%',
        },
        offsetY: 20,
      },
      stroke: {
        colors: undefined
      }
    },
    legend: {
      position: 'left',
      offsetY: 55,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$' + val.toFixed(2);
        }
      }
    },
  };
  
  if (donutChartInstance) {
    donutChartInstance.destroy();
  }

  donutChartInstance = new ApexCharts(
    document.querySelector('#donut-chart'),
    donutChartOptions
  );
  donutChartInstance.render();
};

window.addEventListener("load", () => {
  refreshDashboard();
});

document.addEventListener("languageChanged", () => {
  refreshDashboard();
});

window.addEventListener("biztrackDataChanged", () => {
  refreshDashboard();
});
