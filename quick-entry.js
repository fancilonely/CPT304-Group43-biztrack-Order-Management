(function () {
  const STORAGE_KEYS = {
    products: "bizTrackProducts",
    inventory: "bizTrackInventory",
    orders: "bizTrackOrders",
    transactions: "bizTrackTransactions",
  };
  const PRODUCT_CATALOG = [
    { prodName: "Baseball caps", prodCat: "Hats" },
    { prodName: "Snapbacks", prodCat: "Hats" },
    { prodName: "Beanies", prodCat: "Hats" },
    { prodName: "Bucket hats", prodCat: "Hats" },
    { prodName: "Mugs", prodCat: "Drinkware" },
    { prodName: "Water bottles", prodCat: "Drinkware" },
    { prodName: "Tumblers", prodCat: "Drinkware" },
    { prodName: "T-shirts", prodCat: "Clothing" },
    { prodName: "Sweatshirts", prodCat: "Clothing" },
    { prodName: "Hoodies", prodCat: "Clothing" },
    { prodName: "Pillow cases", prodCat: "Accessories" },
    { prodName: "Tote bags", prodCat: "Accessories" },
    { prodName: "Stickers", prodCat: "Accessories" },
    { prodName: "Posters", prodCat: "Home decor" },
    { prodName: "Framed posters", prodCat: "Home decor" },
    { prodName: "Canvas prints", prodCat: "Home decor" },
  ];
  const PRODUCT_CATEGORIES = ["Hats", "Drinkware", "Clothing", "Accessories", "Home decor"];
  const EXPENSE_CATEGORIES = ["Rent", "Order Fulfillment", "Utilities", "Supplies", "Miscellaneous"];
  const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

  const state = {
    activeModule: "product",
    activeModeByModule: {
      product: "add",
      inventory: "add",
      order: "add",
      expense: "add",
    },
    selectedRecordByModule: {
      product: "",
      inventory: "",
      order: "",
      expense: "",
    },
    feedback: {
      type: "",
      message: "",
    },
  };

  let elements = null;
  let lastTrigger = null;

  function getTextSafe(key) {
    return typeof window.getText === "function" ? window.getText(key) : key;
  }

  function translateValueSafe(value) {
    return typeof window.translateValue === "function" ? window.translateValue(value) : value;
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getFallbackProducts() {
    return [
      { prodID: "PD001", prodName: "Baseball caps", prodDesc: "Peace embroidered cap", prodCat: "Hats", prodPrice: 25, prodSold: 20 },
      { prodID: "PD002", prodName: "Water bottles", prodDesc: "Floral lotus printed bottle", prodCat: "Drinkware", prodPrice: 48.5, prodSold: 10 },
      { prodID: "PD003", prodName: "Sweatshirts", prodDesc: "Palestine sweater", prodCat: "Clothing", prodPrice: 17.5, prodSold: 70 },
      { prodID: "PD004", prodName: "Posters", prodDesc: "Vibes printed poster", prodCat: "Home decor", prodPrice: 12, prodSold: 60 },
      { prodID: "PD005", prodName: "Pillow cases", prodDesc: "Morrocan print pillow case", prodCat: "Accessories", prodPrice: 17, prodSold: 40 },
    ];
  }

  function getFallbackOrders() {
    return [
      { orderID: "1001", orderDate: "2024-01-05", productID: "PD001", itemName: "Baseball caps", itemPrice: 25, qtyBought: 2, shipping: 2.5, taxes: 9, orderTotal: 61.5, orderStatus: "Pending", inventoryApplied: false },
      { orderID: "1002", orderDate: "2024-03-05", productID: "PD002", itemName: "Water bottles", itemPrice: 17, qtyBought: 3, shipping: 3.5, taxes: 6, orderTotal: 60.5, orderStatus: "Processing", inventoryApplied: false },
      { orderID: "1003", orderDate: "2024-02-05", productID: "", itemName: "Tote bags", itemPrice: 20, qtyBought: 4, shipping: 2.5, taxes: 2, orderTotal: 84.5, orderStatus: "Shipped", inventoryApplied: true },
      { orderID: "1004", orderDate: "2023-01-05", productID: "", itemName: "Canvas prints", itemPrice: 55, qtyBought: 1, shipping: 2.5, taxes: 19, orderTotal: 76.5, orderStatus: "Delivered", inventoryApplied: true },
      { orderID: "1005", orderDate: "2024-01-15", productID: "", itemName: "Beanies", itemPrice: 15, qtyBought: 2, shipping: 3.9, taxes: 4, orderTotal: 37.9, orderStatus: "Pending", inventoryApplied: false },
    ];
  }

  function getFallbackTransactions() {
    return [
      { trID: 1, trDate: "2024-01-05", trCategory: "Rent", trAmount: 100, trNotes: "January Rent" },
      { trID: 2, trDate: "2024-01-15", trCategory: "Order Fulfillment", trAmount: 35, trNotes: "Order #1005" },
      { trID: 3, trDate: "2024-01-08", trCategory: "Utilities", trAmount: 120, trNotes: "Internet" },
      { trID: 4, trDate: "2024-02-05", trCategory: "Supplies", trAmount: 180, trNotes: "Embroidery Machine" },
      { trID: 5, trDate: "2024-01-25", trCategory: "Miscellaneous", trAmount: 20, trNotes: "Pizza" },
    ];
  }

  function getStoredCollection(key, fallbackItems) {
    const validators = {
      [STORAGE_KEYS.products]: window.isBizTrackProduct,
      [STORAGE_KEYS.inventory]: window.isBizTrackInventoryItem,
      [STORAGE_KEYS.orders]: window.isBizTrackOrder,
      [STORAGE_KEYS.transactions]: window.isBizTrackTransaction,
    };

    if (typeof window.loadBizTrackCollection === "function") {
      return window.loadBizTrackCollection(key, fallbackItems, validators[key]);
    }

    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallbackItems;
    }

    try {
      const parsed = JSON.parse(storedValue);
      return Array.isArray(parsed) ? parsed : fallbackItems;
    } catch (error) {
      return fallbackItems;
    }
  }

  function saveCollection(key, items) {
    if (typeof window.saveBizTrackCollection === "function") {
      window.saveBizTrackCollection(key, items);
      return;
    }

    localStorage.setItem(key, JSON.stringify(items));
  }

  function getProducts() {
    return getStoredCollection(STORAGE_KEYS.products, getFallbackProducts());
  }

  function getInventory() {
    return getStoredCollection(STORAGE_KEYS.inventory, []);
  }

  function getOrders() {
    return getStoredCollection(STORAGE_KEYS.orders, getFallbackOrders()).map((order) => ({
      ...order,
      orderID: String(order.orderID),
      itemPrice: Number(order.itemPrice),
      qtyBought: Number(order.qtyBought),
      shipping: Number(order.shipping),
      taxes: Number(order.taxes),
      orderTotal: Number(order.orderTotal),
      inventoryApplied: order.inventoryApplied === true,
    }));
  }

  function getTransactions() {
    return getStoredCollection(STORAGE_KEYS.transactions, getFallbackTransactions());
  }

  function isPositiveIntegerString(value) {
    return /^[1-9]\d*$/.test(String(value).trim());
  }

  function isNonNegativeIntegerString(value) {
    return /^(0|[1-9]\d*)$/.test(String(value).trim());
  }

  function isMoneyString(value, { allowZero = false } = {}) {
    const trimmed = String(value).trim();

    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      return false;
    }

    const numberValue = Number(trimmed);

    if (!Number.isFinite(numberValue) || numberValue > 10000) {
      return false;
    }

    return allowZero ? numberValue >= 0 : numberValue > 0;
  }

  function normalizeProductID(rawValue) {
    const trimmed = String(rawValue).trim();

    if (!/^\d+$/.test(trimmed)) {
      return null;
    }

    const numericValue = Number(trimmed);
    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      return null;
    }

    return `PD${String(numericValue).padStart(3, "0")}`;
  }

  function calculateInventoryStatus(stockQuantity, reorderLevel) {
    if (stockQuantity === 0) {
      return "Out of Stock";
    }

    if (stockQuantity <= reorderLevel) {
      return "Low Stock";
    }

    return "In Stock";
  }

  function isFulfilledStatus(status) {
    return status === "Shipped" || status === "Delivered";
  }

  function calculateOrderTotal(itemPrice, qtyBought, shipping, taxes) {
    return (itemPrice * qtyBought) + shipping + taxes;
  }

  function getTodayISODate() {
    return new Date().toISOString().slice(0, 10);
  }

  function getNextInventoryID(inventoryItems) {
    const maxNumericID = inventoryItems.reduce((maxValue, item) => {
      const match = String(item.inventoryID || "").match(/^INV(\d+)$/);
      return match ? Math.max(maxValue, Number(match[1])) : maxValue;
    }, 0);

    return `INV${String(maxNumericID + 1).padStart(3, "0")}`;
  }

  function getNextTransactionID(transactions) {
    return transactions.length > 0
      ? Math.max(...transactions.map((transaction) => Number(transaction.trID) || 0)) + 1
      : 1;
  }

  function findProductRecord(products, productValue, fallbackName = "") {
    return products.find((product) => {
      if (product.prodID === productValue) {
        return true;
      }

      return product.prodName === productValue || product.prodName === fallbackName;
    }) || null;
  }

  function getCatalogEntryByName(productName) {
    return PRODUCT_CATALOG.find((product) => product.prodName === productName) || null;
  }

  function getProductOptionsByCategory(categoryValue = "") {
    if (!categoryValue) {
      return PRODUCT_CATALOG;
    }

    return PRODUCT_CATALOG.filter((product) => product.prodCat === categoryValue);
  }

  function findInventoryRecordByProduct(inventoryItems, product) {
    return inventoryItems.find((item) => {
      if (product.prodID && item.productID) {
        return item.productID === product.prodID;
      }

      return item.productName === product.prodName;
    }) || null;
  }

  function ensureQuickEntryElements() {
    if (elements) {
      return elements;
    }

    document.body.insertAdjacentHTML("beforeend", `
      <div class="quick-entry-overlay" id="quick-entry-overlay" aria-hidden="true" hidden></div>
      <section class="quick-entry-panel" id="quick-entry-panel" role="dialog" aria-modal="true" aria-labelledby="quick-entry-title" tabindex="-1" hidden>
        <div class="quick-entry-shell">
          <div class="quick-entry-tabs" id="quick-entry-tabs" role="tablist"></div>
          <div class="quick-entry-content">
            <div class="quick-entry-panel-header">
              <h2 id="quick-entry-title"></h2>
              <button type="button" class="quick-entry-close-button" id="quick-entry-close-button" aria-label="Close quick entry">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
            <div id="quick-entry-content-body"></div>
          </div>
        </div>
      </section>
    `);

    elements = {
      overlay: document.getElementById("quick-entry-overlay"),
      panel: document.getElementById("quick-entry-panel"),
      tabs: document.getElementById("quick-entry-tabs"),
      title: document.getElementById("quick-entry-title"),
      closeButton: document.getElementById("quick-entry-close-button"),
      body: document.getElementById("quick-entry-content-body"),
    };

    return elements;
  }

  function setFeedback(message, type = "error") {
    state.feedback = { message, type };
    const feedbackElement = elements?.body.querySelector(".quick-entry-feedback");

    if (!feedbackElement) {
      return;
    }

    feedbackElement.hidden = false;
    feedbackElement.className = `quick-entry-feedback is-${type}`;
    feedbackElement.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    feedbackElement.textContent = message;
  }

  function clearFeedback() {
    state.feedback = { message: "", type: "" };
    const feedbackElement = elements?.body.querySelector(".quick-entry-feedback");

    if (!feedbackElement) {
      return;
    }

    feedbackElement.hidden = true;
    feedbackElement.className = "quick-entry-feedback";
    feedbackElement.setAttribute("aria-live", "polite");
    feedbackElement.textContent = "";
  }

  function openQuickEntry(trigger) {
    const { overlay, panel } = ensureQuickEntryElements();
    lastTrigger = trigger || document.activeElement;
    clearFeedback();
    renderQuickEntry();
    overlay.hidden = false;
    panel.hidden = false;
    document.body.classList.add("quick-entry-panel-open");
    window.requestAnimationFrame(() => panel.focus());
  }

  function closeQuickEntry() {
    const { overlay, panel } = ensureQuickEntryElements();
    overlay.hidden = true;
    panel.hidden = true;
    document.body.classList.remove("quick-entry-panel-open");

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  function buildModuleTabsMarkup() {
    const tabItems = [
      { key: "product", icon: "fa-box-open" },
      { key: "inventory", icon: "fa-boxes-stacked" },
      { key: "order", icon: "fa-cart-shopping" },
      { key: "expense", icon: "fa-receipt" },
    ];

    return tabItems.map(({ key, icon }) => {
      const isActive = state.activeModule === key;

      return `
      <button type="button" class="quick-entry-tab${isActive ? " is-active" : ""}" data-quick-entry-tab="${key}" role="tab" aria-selected="${isActive}" aria-controls="quick-entry-content-body" tabindex="${isActive ? "0" : "-1"}">
        <i class="fa-solid ${icon}" aria-hidden="true"></i>
        <span>${escapeHTML(getTextSafe(key))}</span>
      </button>
    `;
    }).join("");
  }

  function buildModeTabsMarkup(moduleKey) {
    const activeMode = state.activeModeByModule[moduleKey];
    return `
      <div class="quick-entry-mode-tabs" role="tablist" aria-label="${escapeHTML(getTextSafe("quickBusinessEntry"))}">
        <button type="button" class="quick-entry-mode-tab${activeMode === "edit" ? " is-active" : ""}" data-quick-entry-mode="edit" role="tab" aria-selected="${activeMode === "edit"}" aria-controls="quick-entry-content-body" tabindex="${activeMode === "edit" ? "0" : "-1"}">${escapeHTML(getTextSafe("edit"))}</button>
        <button type="button" class="quick-entry-mode-tab${activeMode === "add" ? " is-active" : ""}" data-quick-entry-mode="add" role="tab" aria-selected="${activeMode === "add"}" aria-controls="quick-entry-content-body" tabindex="${activeMode === "add" ? "0" : "-1"}">${escapeHTML(getTextSafe("add"))}</button>
      </div>
    `;
  }

  function buildFeedbackMarkup() {
    if (!state.feedback.message) {
      return '<p class="quick-entry-feedback" role="status" aria-live="polite" aria-atomic="true" hidden></p>';
    }

    const liveMode = state.feedback.type === "error" ? "assertive" : "polite";
    return `<p class="quick-entry-feedback is-${escapeHTML(state.feedback.type)}" role="status" aria-live="${liveMode}" aria-atomic="true">${escapeHTML(state.feedback.message)}</p>`;
  }

  function buildOptions(items, {
    placeholderKey,
    valueKey,
    label,
    labelKey,
    selectedValue = "",
    useTranslatedValue = false,
  }) {
    const placeholder = `<option value="">${escapeHTML(getTextSafe(placeholderKey))}</option>`;

    const options = items.map((item) => {
      const optionValue = item[valueKey];
      const optionLabel = label
        ? label(item)
        : useTranslatedValue
          ? translateValueSafe(item[labelKey || valueKey])
          : item[labelKey || valueKey];
      const isSelected = String(optionValue) === String(selectedValue) ? " selected" : "";

      return `<option value="${escapeHTML(optionValue)}"${isSelected}>${escapeHTML(optionLabel)}</option>`;
    }).join("");

    return `${placeholder}${options}`;
  }

  function buildCategoryOptions(selectedValue = "") {
    return buildOptions(PRODUCT_CATEGORIES.map((category) => ({ value: category })), {
      placeholderKey: "chooseCategory",
      valueKey: "value",
      labelKey: "value",
      selectedValue,
      useTranslatedValue: true,
    });
  }

  function buildStatusOptions(selectedValue = "") {
    return buildOptions(ORDER_STATUSES.map((status) => ({ value: status })), {
      placeholderKey: "chooseStatus",
      valueKey: "value",
      labelKey: "value",
      selectedValue,
      useTranslatedValue: true,
    });
  }

  function buildExpenseCategoryOptions(selectedValue = "") {
    return buildOptions(EXPENSE_CATEGORIES.map((category) => ({ value: category })), {
      placeholderKey: "chooseExpenseCategory",
      valueKey: "value",
      labelKey: "value",
      selectedValue,
      useTranslatedValue: true,
    });
  }

  function buildProductForm() {
    const products = getProducts();
    const mode = state.activeModeByModule.product;
    const selectedId = state.selectedRecordByModule.product;
    const selectedProduct = products.find((product) => product.prodID === selectedId) || null;
    const formProduct = selectedProduct || { prodID: "", prodName: "", prodDesc: "", prodCat: "", prodPrice: "", prodSold: "" };
    const matchedCatalogProduct = getCatalogEntryByName(formProduct.prodName);
    const effectiveCategory = matchedCatalogProduct?.prodCat || formProduct.prodCat || "";
    const productNameOptions = buildOptions(getProductOptionsByCategory(effectiveCategory), {
      placeholderKey: "chooseProduct",
      valueKey: "prodName",
      labelKey: "prodName",
      selectedValue: formProduct.prodName,
      useTranslatedValue: true,
    });

    return `
      <section class="quick-entry-section is-active">
        <div class="quick-entry-section-heading">
          <span class="quick-entry-context-label">${escapeHTML(getTextSafe("product"))}</span>
        </div>
        ${buildModeTabsMarkup("product")}
        <div class="quick-entry-form-shell ${mode === "edit" ? "mode-edit" : "mode-add"}">
          ${buildFeedbackMarkup()}
          <form class="quick-entry-form" id="quick-entry-form-product" novalidate>
            ${mode === "edit" ? `
              <div class="quick-entry-field quick-entry-field--full">
                <label for="qe-product-select">${escapeHTML(getTextSafe("selectProduct"))}</label>
                <select id="qe-product-select" data-record-select="product">
                  ${buildOptions(products, {
                    placeholderKey: "selectProduct",
                    valueKey: "prodID",
                    label: (product) => `${product.prodID} - ${product.prodName}`,
                    selectedValue: selectedId,
                  })}
                </select>
              </div>
            ` : ""}
            <div class="quick-entry-field">
              <label for="qe-product-id">${escapeHTML(getTextSafe("productIDShort"))}</label>
              <input id="qe-product-id" name="productId" type="number" min="1" step="1" value="${escapeHTML(String(formProduct.prodID || "").replace(/^PD0*/, ""))}" ${mode === "edit" ? "disabled" : ""}>
            </div>
            <div class="quick-entry-field">
              <label for="qe-product-name">${escapeHTML(getTextSafe("productName"))}</label>
              <select id="qe-product-name" name="productName">${productNameOptions}</select>
            </div>
            <div class="quick-entry-field">
              <label for="qe-product-category">${escapeHTML(getTextSafe("productCategory"))}</label>
              <select id="qe-product-category" name="productCategory">${buildCategoryOptions(effectiveCategory)}</select>
            </div>
            <div class="quick-entry-field">
              <label for="qe-product-price">${escapeHTML(getTextSafe("productPrice"))}</label>
              <input id="qe-product-price" name="productPrice" type="number" min="0.01" step="0.01" value="${escapeHTML(formProduct.prodPrice)}">
            </div>
            <div class="quick-entry-field quick-entry-field--full">
              <label for="qe-product-description">${escapeHTML(getTextSafe("productDescription"))}</label>
              <textarea id="qe-product-description" name="productDescription" rows="3" maxlength="120">${escapeHTML(formProduct.prodDesc)}</textarea>
            </div>
            <div class="quick-entry-field">
              <label for="qe-product-sold">${escapeHTML(getTextSafe("unitsSold"))}</label>
              <input id="qe-product-sold" name="productSold" type="number" min="0" step="1" value="${escapeHTML(formProduct.prodSold)}">
            </div>
            <div class="quick-entry-actions">
              <button type="submit" class="quick-entry-submit-button">${escapeHTML(getTextSafe(mode === "edit" ? "edit" : "add"))}</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function buildInventoryForm() {
    const products = getProducts();
    const inventoryItems = getInventory();
    const mode = state.activeModeByModule.inventory;
    const selectedId = state.selectedRecordByModule.inventory;
    const selectedItem = inventoryItems.find((item) => item.inventoryID === selectedId) || null;
    const currentProduct = selectedItem
      ? findProductRecord(products, selectedItem.productID, selectedItem.productName)
      : null;
    const formItem = selectedItem || {
      productID: "",
      productName: "",
      category: "",
      stockQuantity: "",
      reorderLevel: 5,
      supplier: "",
      lastUpdated: getTodayISODate(),
    };

    const productOptions = buildOptions(products, {
      placeholderKey: "selectProduct",
      valueKey: "prodID",
      label: (product) => `${product.prodID} - ${product.prodName}`,
      selectedValue: formItem.productID,
    });

    return `
      <section class="quick-entry-section is-active">
        <div class="quick-entry-section-heading">
          <span class="quick-entry-context-label">${escapeHTML(getTextSafe("inventory"))}</span>
        </div>
        ${buildModeTabsMarkup("inventory")}
        <div class="quick-entry-form-shell ${mode === "edit" ? "mode-edit" : "mode-add"}">
          ${buildFeedbackMarkup()}
          <form class="quick-entry-form" id="quick-entry-form-inventory" novalidate>
            ${mode === "edit" ? `
              <div class="quick-entry-field quick-entry-field--full">
                <label for="qe-inventory-select">${escapeHTML(getTextSafe("selectInventoryItem"))}</label>
                <select id="qe-inventory-select" data-record-select="inventory">
                  ${buildOptions(inventoryItems, {
                    placeholderKey: "selectInventoryItem",
                    valueKey: "inventoryID",
                    label: (item) => `${item.inventoryID} - ${item.productName}`,
                    selectedValue: selectedId,
                  })}
                </select>
              </div>
            ` : ""}
            <div class="quick-entry-field">
              <label for="qe-inventory-product">${escapeHTML(getTextSafe("selectProduct"))}</label>
              ${mode === "edit"
                ? `<input id="qe-inventory-product" type="text" value="${escapeHTML(currentProduct?.prodName || formItem.productName)}" disabled>`
                : `<select id="qe-inventory-product" name="inventoryProduct">${productOptions}</select>`}
            </div>
            <div class="quick-entry-field">
              <label for="qe-inventory-category">${escapeHTML(getTextSafe("category"))}</label>
              <input id="qe-inventory-category" type="text" value="${escapeHTML(currentProduct?.prodCat || formItem.category)}" disabled>
            </div>
            <div class="quick-entry-field">
              <label for="qe-inventory-stock">${escapeHTML(getTextSafe("stockQuantity"))}</label>
              <input id="qe-inventory-stock" name="stockQuantity" type="number" min="0" step="1" value="${escapeHTML(formItem.stockQuantity)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-inventory-reorder">${escapeHTML(getTextSafe("reorderLevel"))}</label>
              <input id="qe-inventory-reorder" name="reorderLevel" type="number" min="0" step="1" value="${escapeHTML(formItem.reorderLevel)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-inventory-supplier">${escapeHTML(getTextSafe("supplier"))}</label>
              <input id="qe-inventory-supplier" name="supplier" type="text" maxlength="80" value="${escapeHTML(formItem.supplier === "Not assigned" ? "" : formItem.supplier)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-inventory-date">${escapeHTML(getTextSafe("lastUpdated"))}</label>
              <input id="qe-inventory-date" name="lastUpdated" type="date" value="${escapeHTML(formItem.lastUpdated)}">
            </div>
            <div class="quick-entry-actions">
              <button type="submit" class="quick-entry-submit-button">${escapeHTML(getTextSafe(mode === "edit" ? "edit" : "add"))}</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function buildOrderForm() {
    const products = getProducts();
    const orders = getOrders();
    const mode = state.activeModeByModule.order;
    const selectedId = state.selectedRecordByModule.order;
    const selectedOrder = orders.find((order) => order.orderID === selectedId) || null;
    const lockedInventory = selectedOrder?.inventoryApplied === true;
    const matchedProduct = selectedOrder
      ? findProductRecord(products, selectedOrder.productID, selectedOrder.itemName)
      : null;
    const formOrder = selectedOrder || {
      orderID: "",
      orderDate: getTodayISODate(),
      productID: "",
      itemName: "",
      itemPrice: "",
      qtyBought: 1,
      shipping: 0,
      taxes: 0,
      orderTotal: 0,
      orderStatus: "Pending",
    };
    const selectedProductValue = matchedProduct?.prodID || formOrder.productID;

    return `
      <section class="quick-entry-section is-active">
        <div class="quick-entry-section-heading">
          <span class="quick-entry-context-label">${escapeHTML(getTextSafe("order"))}</span>
        </div>
        ${buildModeTabsMarkup("order")}
        <div class="quick-entry-form-shell ${mode === "edit" ? "mode-edit" : "mode-add"}">
          ${buildFeedbackMarkup()}
          <form class="quick-entry-form" id="quick-entry-form-order" novalidate>
            ${mode === "edit" ? `
              <div class="quick-entry-field quick-entry-field--full">
                <label for="qe-order-select">${escapeHTML(getTextSafe("selectOrder"))}</label>
                <select id="qe-order-select" data-record-select="order">
                  ${buildOptions(orders, {
                    placeholderKey: "selectOrder",
                    valueKey: "orderID",
                    label: (order) => `#${order.orderID} - ${order.itemName}`,
                    selectedValue: selectedId,
                  })}
                </select>
              </div>
            ` : ""}
            <div class="quick-entry-field">
              <label for="qe-order-id">${escapeHTML(getTextSafe("orderIDShort"))}</label>
              <input id="qe-order-id" type="number" min="1" step="1" value="${escapeHTML(formOrder.orderID)}" ${mode === "edit" ? "disabled" : ""}>
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-date">${escapeHTML(getTextSafe("orderDateShort"))}</label>
              <input id="qe-order-date" type="date" value="${escapeHTML(formOrder.orderDate)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-product">${escapeHTML(getTextSafe("selectProduct"))}</label>
              ${mode === "edit" && selectedOrder && !matchedProduct
                ? `<input id="qe-order-product-legacy" type="text" value="${escapeHTML(selectedOrder.itemName)}" disabled>`
                : `<select id="qe-order-product" ${lockedInventory ? "disabled" : ""}>
                    ${buildOptions(products, {
                      placeholderKey: "selectProduct",
                      valueKey: "prodID",
                      label: (product) => `${product.prodID} - ${product.prodName}`,
                      selectedValue: selectedProductValue,
                    })}
                  </select>`}
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-price">${escapeHTML(getTextSafe("itemPriceShort"))}</label>
              <input id="qe-order-price" type="number" min="0.01" step="0.01" value="${escapeHTML(formOrder.itemPrice)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-qty">${escapeHTML(getTextSafe("qty"))}</label>
              <input id="qe-order-qty" type="number" min="1" step="1" value="${escapeHTML(formOrder.qtyBought)}" ${lockedInventory ? "disabled" : ""}>
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-shipping">${escapeHTML(getTextSafe("shippingFeeShort"))}</label>
              <input id="qe-order-shipping" type="number" min="0" step="0.01" value="${escapeHTML(formOrder.shipping)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-taxes">${escapeHTML(getTextSafe("taxesShort"))}</label>
              <input id="qe-order-taxes" type="number" min="0" step="0.01" value="${escapeHTML(formOrder.taxes)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-order-status">${escapeHTML(getTextSafe("orderStatusShort"))}</label>
              <select id="qe-order-status">${buildStatusOptions(formOrder.orderStatus)}</select>
            </div>
            <div class="quick-entry-field quick-entry-field--full">
              <label for="qe-order-total">${escapeHTML(getTextSafe("totalOrderAmount"))}</label>
              <input id="qe-order-total" type="text" value="$${escapeHTML(Number(formOrder.orderTotal || 0).toFixed(2))}" readonly>
            </div>
            <div class="quick-entry-actions">
              <button type="submit" class="quick-entry-submit-button">${escapeHTML(getTextSafe(mode === "edit" ? "edit" : "add"))}</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function buildExpenseForm() {
    const transactions = getTransactions();
    const mode = state.activeModeByModule.expense;
    const selectedId = state.selectedRecordByModule.expense;
    const selectedExpense = transactions.find((transaction) => String(transaction.trID) === String(selectedId)) || null;
    const formExpense = selectedExpense || { trDate: getTodayISODate(), trCategory: "", trAmount: "", trNotes: "" };

    return `
      <section class="quick-entry-section is-active">
        <div class="quick-entry-section-heading">
          <span class="quick-entry-context-label">${escapeHTML(getTextSafe("expense"))}</span>
        </div>
        ${buildModeTabsMarkup("expense")}
        <div class="quick-entry-form-shell ${mode === "edit" ? "mode-edit" : "mode-add"}">
          ${buildFeedbackMarkup()}
          <form class="quick-entry-form" id="quick-entry-form-expense" novalidate>
            ${mode === "edit" ? `
              <div class="quick-entry-field quick-entry-field--full">
                <label for="qe-expense-select">${escapeHTML(getTextSafe("selectExpense"))}</label>
                <select id="qe-expense-select" data-record-select="expense">
                  ${buildOptions(transactions, {
                    placeholderKey: "selectExpense",
                    valueKey: "trID",
                    label: (transaction) => `#${transaction.trID} - ${transaction.trNotes}`,
                    selectedValue: selectedId,
                  })}
                </select>
              </div>
            ` : ""}
            <div class="quick-entry-field">
              <label for="qe-expense-date">${escapeHTML(getTextSafe("dateShort"))}</label>
              <input id="qe-expense-date" type="date" value="${escapeHTML(formExpense.trDate)}">
            </div>
            <div class="quick-entry-field">
              <label for="qe-expense-category">${escapeHTML(getTextSafe("expenseCategory"))}</label>
              <select id="qe-expense-category">${buildExpenseCategoryOptions(formExpense.trCategory)}</select>
            </div>
            <div class="quick-entry-field">
              <label for="qe-expense-amount">${escapeHTML(getTextSafe("amountShort"))}</label>
              <input id="qe-expense-amount" type="number" min="0.01" step="0.01" value="${escapeHTML(formExpense.trAmount)}">
            </div>
            <div class="quick-entry-field quick-entry-field--full">
              <label for="qe-expense-notes">${escapeHTML(getTextSafe("notesShort"))}</label>
              <textarea id="qe-expense-notes" rows="3" maxlength="120">${escapeHTML(formExpense.trNotes)}</textarea>
            </div>
            <div class="quick-entry-actions">
              <button type="submit" class="quick-entry-submit-button">${escapeHTML(getTextSafe(mode === "edit" ? "edit" : "add"))}</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function renderModuleContent() {
    if (!elements) {
      return;
    }

    if (state.activeModule === "product") {
      elements.body.innerHTML = buildProductForm();
    } else if (state.activeModule === "inventory") {
      elements.body.innerHTML = buildInventoryForm();
    } else if (state.activeModule === "order") {
      elements.body.innerHTML = buildOrderForm();
    } else {
      elements.body.innerHTML = buildExpenseForm();
    }

    bindDynamicEvents();
    if (state.activeModule === "product") {
      const currentCategory = document.getElementById("qe-product-category")?.value || "";
      const currentProductName = document.getElementById("qe-product-name")?.value || "";
      syncQuickEntryProductSelects(currentCategory, currentProductName);
    }
    updateOrderTotalField();
    syncInventoryCategoryField();
  }

  function renderQuickEntry() {
    const quickEntryElements = ensureQuickEntryElements();
    quickEntryElements.title.textContent = getTextSafe("quickBusinessEntry");
    quickEntryElements.closeButton.setAttribute("aria-label", getTextSafe("closeQuickEntry"));
    quickEntryElements.tabs.setAttribute("aria-label", getTextSafe("quickBusinessEntry"));
    quickEntryElements.tabs.innerHTML = buildModuleTabsMarkup();
    renderModuleContent();
  }

  function syncInventoryCategoryField() {
    const productSelect = document.getElementById("qe-inventory-product");
    const categoryField = document.getElementById("qe-inventory-category");

    if (!productSelect || !categoryField || productSelect.tagName !== "SELECT") {
      return;
    }

    const products = getProducts();
    const selectedProduct = products.find((product) => product.prodID === productSelect.value);
    categoryField.value = selectedProduct ? selectedProduct.prodCat : "";
  }

  function updateOrderPriceFromSelection() {
    const productSelect = document.getElementById("qe-order-product");
    const priceInput = document.getElementById("qe-order-price");

    if (!productSelect || !priceInput || !productSelect.value) {
      return;
    }

    const products = getProducts();
    const selectedProduct = products.find((product) => product.prodID === productSelect.value);

    if (selectedProduct) {
      priceInput.value = Number(selectedProduct.prodPrice).toFixed(2);
      updateOrderTotalField();
    }
  }

  function updateOrderTotalField() {
    const totalField = document.getElementById("qe-order-total");
    const priceInput = document.getElementById("qe-order-price");
    const qtyInput = document.getElementById("qe-order-qty");
    const shippingInput = document.getElementById("qe-order-shipping");
    const taxesInput = document.getElementById("qe-order-taxes");

    if (!totalField || !priceInput || !qtyInput || !shippingInput || !taxesInput) {
      return;
    }

    const itemPrice = Number(priceInput.value) || 0;
    const qtyBought = Number(qtyInput.value) || 0;
    const shipping = Number(shippingInput.value) || 0;
    const taxes = Number(taxesInput.value) || 0;
    const total = calculateOrderTotal(itemPrice, qtyBought, shipping, taxes);

    totalField.value = `$${total.toFixed(2)}`;
  }

  function populateQuickEntryProductNameOptions(selectedCategory = "", selectedProductName = "") {
    const productNameSelect = document.getElementById("qe-product-name");

    if (!productNameSelect) {
      return;
    }

    productNameSelect.innerHTML = buildOptions(getProductOptionsByCategory(selectedCategory), {
      placeholderKey: "chooseProduct",
      valueKey: "prodName",
      labelKey: "prodName",
      selectedValue: selectedProductName,
      useTranslatedValue: true,
    });
  }

  function syncQuickEntryProductSelects(selectedCategory = "", selectedProductName = "") {
    const categorySelect = document.getElementById("qe-product-category");
    const matchedProduct = getCatalogEntryByName(selectedProductName);
    const effectiveCategory = matchedProduct?.prodCat || selectedCategory || "";

    if (categorySelect) {
      categorySelect.value = effectiveCategory;
    }

    populateQuickEntryProductNameOptions(effectiveCategory, selectedProductName);
  }

  function handleQuickEntryProductCategoryChange() {
    const categorySelect = document.getElementById("qe-product-category");

    if (!categorySelect) {
      return;
    }

    populateQuickEntryProductNameOptions(categorySelect.value, "");
  }

  function handleQuickEntryProductNameChange() {
    const productNameSelect = document.getElementById("qe-product-name");

    if (!productNameSelect) {
      return;
    }

    const matchedProduct = getCatalogEntryByName(productNameSelect.value);

    if (!matchedProduct) {
      return;
    }

    syncQuickEntryProductSelects(matchedProduct.prodCat, matchedProduct.prodName);
  }

  function switchModule(moduleKey) {
    state.activeModule = moduleKey;
    clearFeedback();
    renderQuickEntry();
  }

  function switchMode(mode) {
    state.activeModeByModule[state.activeModule] = mode;
    clearFeedback();
    renderModuleContent();
  }

  function handleRecordSelection(moduleKey, value) {
    state.selectedRecordByModule[moduleKey] = value;
    clearFeedback();
    renderModuleContent();
  }

  function dispatchDashboardRefresh() {
    window.dispatchEvent(new Event("biztrackDataChanged"));
  }

  function recordQuickEntryActivity(activity) {
    if (typeof window.recordActivity === "function") {
      window.recordActivity(activity);
    }
  }

  function syncInventoryWithProductSave(product, inventoryItems) {
    const existingInventory = findInventoryRecordByProduct(inventoryItems, product);

    if (existingInventory) {
      existingInventory.productID = product.prodID;
      existingInventory.productName = product.prodName;
      existingInventory.category = product.prodCat;
      return inventoryItems;
    }

    inventoryItems.push({
      inventoryID: getNextInventoryID(inventoryItems),
      productID: product.prodID,
      productName: product.prodName,
      category: product.prodCat,
      stockQuantity: 0,
      reorderLevel: 5,
      supplier: "Not assigned",
      lastUpdated: getTodayISODate(),
      status: "Out of Stock",
      autoCreated: true,
    });

    return inventoryItems;
  }

  function validateProductPayload(currentID) {
    const rawProductID = document.getElementById("qe-product-id")?.value || "";
    const prodName = document.getElementById("qe-product-name")?.value || "";
    const selectedCategory = document.getElementById("qe-product-category")?.value || "";
    const prodDesc = document.getElementById("qe-product-description")?.value.trim() || "";
    const rawProdPrice = document.getElementById("qe-product-price")?.value || "";
    const rawProdSold = document.getElementById("qe-product-sold")?.value || "";
    const products = getProducts();
    const prodID = currentID || normalizeProductID(rawProductID);
    const matchedProduct = getCatalogEntryByName(prodName);
    const prodCat = matchedProduct?.prodCat || selectedCategory;

    if (!prodID) {
      return { error: getTextSafe("productIdInvalid") };
    }

    if (!prodName) {
      return { error: getTextSafe("productNameRequired") };
    }

    if (!prodDesc) {
      return { error: getTextSafe("productDescriptionRequired") };
    }

    if (prodDesc.length > 120) {
      return { error: getTextSafe("productDescriptionTooLong") };
    }

    if (!prodCat) {
      return { error: getTextSafe("productCategoryRequired") };
    }

    if (!isMoneyString(rawProdPrice)) {
      return { error: getTextSafe("productPriceInvalid") };
    }

    if (!isNonNegativeIntegerString(rawProdSold)) {
      return { error: getTextSafe("unitsSoldInvalid") };
    }

    const duplicate = products.some((product) => product.prodID === prodID && product.prodID !== currentID);
    if (duplicate) {
      return { error: getTextSafe("duplicateProductId") };
    }

    return {
      value: {
        prodID,
        prodName,
        prodCat,
        prodDesc,
        prodPrice: Number(rawProdPrice),
        prodSold: Number(rawProdSold),
      },
    };
  }

  function saveProduct(event) {
    event.preventDefault();
    const mode = state.activeModeByModule.product;
    const currentID = mode === "edit" ? state.selectedRecordByModule.product : null;

    if (mode === "edit" && !currentID) {
      setFeedback(getTextSafe("chooseRecordToEdit"));
      return;
    }

    const validation = validateProductPayload(currentID);
    if (validation.error) {
      setFeedback(validation.error);
      return;
    }

    const products = getProducts();
    const inventoryItems = getInventory();
    const product = validation.value;

    if (mode === "edit") {
      const index = products.findIndex((item) => item.prodID === currentID);
      products[index] = product;
    } else {
      products.push(product);
      state.selectedRecordByModule.product = product.prodID;
    }

    syncInventoryWithProductSave(product, inventoryItems);
    saveCollection(STORAGE_KEYS.products, products);
    saveCollection(STORAGE_KEYS.inventory, inventoryItems);
    recordQuickEntryActivity({
      moduleKey: "products",
      actionKey: mode === "edit" ? "activityProductUpdated" : "activityProductCreated",
      entityId: product.prodID,
      entityName: product.prodName,
    });
    dispatchDashboardRefresh();
    setFeedback(getTextSafe(mode === "edit" ? "recordUpdated" : "productSaved"), "success");
  }

  function validateInventoryPayload(currentItem) {
    const products = getProducts();
    const inventoryItems = getInventory();
    const selectedProductId = currentItem ? currentItem.productID : (document.getElementById("qe-inventory-product")?.value || "");
    const selectedProduct = findProductRecord(products, selectedProductId) || (currentItem ? {
      prodID: currentItem.productID || "",
      prodName: currentItem.productName,
      prodCat: currentItem.category,
    } : null);
    const rawStockQuantity = document.getElementById("qe-inventory-stock")?.value || "";
    const rawReorderLevel = document.getElementById("qe-inventory-reorder")?.value || "";
    const supplier = document.getElementById("qe-inventory-supplier")?.value.trim() || "";
    const lastUpdated = document.getElementById("qe-inventory-date")?.value || "";

    if (!selectedProduct) {
      return { error: getTextSafe("inventoryProductRequired") };
    }

    if (!isNonNegativeIntegerString(rawStockQuantity)) {
      return { error: getTextSafe("stockQuantityInvalid") };
    }

    if (!isNonNegativeIntegerString(rawReorderLevel)) {
      return { error: getTextSafe("reorderLevelInvalid") };
    }

    if (!supplier) {
      return { error: getTextSafe("supplierRequired") };
    }

    if (supplier.length > 80) {
      return { error: getTextSafe("supplierTooLong") };
    }

    if (!lastUpdated) {
      return { error: getTextSafe("lastUpdatedRequired") };
    }

    if (!currentItem && findInventoryRecordByProduct(inventoryItems, selectedProduct)) {
      return { error: getTextSafe("inventoryExistsSwitchEdit") };
    }

    const stockQuantity = Number(rawStockQuantity);
    const reorderLevel = Number(rawReorderLevel);

    return {
      value: {
        inventoryID: currentItem?.inventoryID || getNextInventoryID(inventoryItems),
        productID: selectedProduct.prodID,
        productName: selectedProduct.prodName,
        category: selectedProduct.prodCat,
        stockQuantity,
        reorderLevel,
        supplier,
        lastUpdated,
        status: calculateInventoryStatus(stockQuantity, reorderLevel),
        autoCreated: false,
      },
    };
  }

  function saveInventory(event) {
    event.preventDefault();
    const mode = state.activeModeByModule.inventory;
    const inventoryItems = getInventory();
    const currentItem = mode === "edit"
      ? inventoryItems.find((item) => item.inventoryID === state.selectedRecordByModule.inventory) || null
      : null;

    if (mode === "edit" && !currentItem) {
      setFeedback(getTextSafe("chooseRecordToEdit"));
      return;
    }

    const validation = validateInventoryPayload(currentItem);
    if (validation.error) {
      setFeedback(validation.error);
      return;
    }

    const payload = validation.value;

    if (mode === "edit") {
      const index = inventoryItems.findIndex((item) => item.inventoryID === currentItem.inventoryID);
      inventoryItems[index] = payload;
    } else {
      inventoryItems.push(payload);
      state.selectedRecordByModule.inventory = payload.inventoryID;
    }

    saveCollection(STORAGE_KEYS.inventory, inventoryItems);
    recordQuickEntryActivity({
      moduleKey: "inventory",
      actionKey: mode === "edit" ? "activityInventoryUpdated" : "activityInventoryCreated",
      entityId: payload.inventoryID,
      entityName: payload.productName,
    });
    dispatchDashboardRefresh();
    setFeedback(getTextSafe(mode === "edit" ? "recordUpdated" : "inventorySaved"), "success");
  }

  function buildOrderPayload(previousOrder) {
    const products = getProducts();
    const selectedProductId = document.getElementById("qe-order-product")?.value || "";
    const selectedProduct = findProductRecord(products, selectedProductId) || (previousOrder ? {
      prodID: previousOrder.productID || "",
      prodName: previousOrder.itemName,
      prodCat: "",
    } : null);
    const rawOrderID = document.getElementById("qe-order-id")?.value || "";
    const orderDate = document.getElementById("qe-order-date")?.value || "";
    const rawItemPrice = document.getElementById("qe-order-price")?.value || "";
    const rawQtyBought = document.getElementById("qe-order-qty")?.value || "";
    const rawShipping = document.getElementById("qe-order-shipping")?.value || "";
    const rawTaxes = document.getElementById("qe-order-taxes")?.value || "";
    const orderStatus = document.getElementById("qe-order-status")?.value || "";
    const orders = getOrders();

    const orderID = previousOrder ? String(previousOrder.orderID) : (isPositiveIntegerString(rawOrderID) ? String(Number(rawOrderID)) : "");
    if (!orderID) {
      return { error: getTextSafe("orderIdInvalid") };
    }

    if (orders.some((order) => order.orderID === orderID && order.orderID !== previousOrder?.orderID)) {
      return { error: getTextSafe("duplicateOrderId") };
    }

    if (!orderDate) {
      return { error: getTextSafe("orderDateRequired") };
    }

    if (!selectedProduct) {
      return { error: getTextSafe("orderProductRequired") };
    }

    if (!isMoneyString(rawItemPrice)) {
      return { error: getTextSafe("orderPriceInvalid") };
    }

    if (!isPositiveIntegerString(rawQtyBought)) {
      return { error: getTextSafe("orderQuantityInvalid") };
    }

    if (!isMoneyString(rawShipping, { allowZero: true })) {
      return { error: getTextSafe("shippingInvalid") };
    }

    if (!isMoneyString(rawTaxes, { allowZero: true })) {
      return { error: getTextSafe("taxesInvalid") };
    }

    if (!orderStatus) {
      return { error: getTextSafe("orderStatusRequired") };
    }

    const itemPrice = Number(rawItemPrice);
    const qtyBought = Number(rawQtyBought);
    const shipping = Number(rawShipping);
    const taxes = Number(rawTaxes);
    const orderTotal = calculateOrderTotal(itemPrice, qtyBought, shipping, taxes);

    if (previousOrder?.inventoryApplied === true) {
      const productChanged = previousOrder.productID !== selectedProduct.prodID || previousOrder.qtyBought !== qtyBought;
      if (productChanged) {
        return { error: getTextSafe("fulfilledOrderLocked") };
      }
    }

    return {
      value: {
        orderID,
        orderDate,
        productID: selectedProduct.prodID,
        itemName: selectedProduct.prodName,
        itemPrice,
        qtyBought,
        shipping,
        taxes,
        orderTotal,
        orderStatus,
        inventoryApplied: previousOrder?.inventoryApplied === true,
      },
    };
  }

  function applyOrderInventoryRules(order, previousOrder) {
    const inventoryItems = getInventory();

    if (order.inventoryApplied === true) {
      return { inventoryItems, order };
    }

    if (!isFulfilledStatus(order.orderStatus)) {
      return { inventoryItems, order };
    }

    const inventoryItem = inventoryItems.find((item) => item.productID === order.productID || item.productName === order.itemName);
    if (!inventoryItem) {
      return { error: getTextSafe("inventoryRecordRequired") };
    }

    if (Number(inventoryItem.stockQuantity) < order.qtyBought) {
      return { error: getTextSafe("notEnoughStock") };
    }

    inventoryItem.stockQuantity = Number(inventoryItem.stockQuantity) - order.qtyBought;
    inventoryItem.status = calculateInventoryStatus(Number(inventoryItem.stockQuantity), Number(inventoryItem.reorderLevel) || 0);
    inventoryItem.lastUpdated = getTodayISODate();
    inventoryItem.autoCreated = false;
    order.inventoryApplied = true;

    return { inventoryItems, order, previousOrder };
  }

  function saveOrder(event) {
    event.preventDefault();
    const orders = getOrders();
    const mode = state.activeModeByModule.order;
    const previousOrder = mode === "edit"
      ? orders.find((order) => order.orderID === state.selectedRecordByModule.order) || null
      : null;

    if (mode === "edit" && !previousOrder) {
      setFeedback(getTextSafe("chooseRecordToEdit"));
      return;
    }

    const validation = buildOrderPayload(previousOrder);
    if (validation.error) {
      setFeedback(validation.error);
      return;
    }

    const nextOrder = validation.value;
    const inventoryResult = applyOrderInventoryRules(nextOrder, previousOrder);
    if (inventoryResult.error) {
      setFeedback(inventoryResult.error);
      return;
    }

    if (mode === "edit") {
      const index = orders.findIndex((order) => order.orderID === previousOrder.orderID);
      orders[index] = nextOrder;
    } else {
      orders.push(nextOrder);
      state.selectedRecordByModule.order = nextOrder.orderID;
    }

    saveCollection(STORAGE_KEYS.orders, orders);
    saveCollection(STORAGE_KEYS.inventory, inventoryResult.inventoryItems);
    recordQuickEntryActivity({
      moduleKey: "orders",
      actionKey: mode === "edit" ? "activityOrderUpdated" : "activityOrderCreated",
      entityId: `#${nextOrder.orderID}`,
      entityName: nextOrder.itemName,
      amount: Number(nextOrder.orderTotal),
    });
    dispatchDashboardRefresh();
    setFeedback(getTextSafe(mode === "edit" ? "recordUpdated" : "orderSaved"), "success");
  }

  function buildExpensePayload(previousExpense) {
    const trDate = document.getElementById("qe-expense-date")?.value || "";
    const trCategory = document.getElementById("qe-expense-category")?.value || "";
    const rawTrAmount = document.getElementById("qe-expense-amount")?.value || "";
    const trNotes = document.getElementById("qe-expense-notes")?.value.trim() || "";

    if (!trDate) {
      return { error: getTextSafe("expenseDateRequired") };
    }

    if (!EXPENSE_CATEGORIES.includes(trCategory)) {
      return { error: getTextSafe("expenseCategoryRequired") };
    }

    if (!isMoneyString(rawTrAmount)) {
      return { error: getTextSafe("expenseAmountInvalid") };
    }

    if (!trNotes) {
      return { error: getTextSafe("expenseNotesRequired") };
    }

    if (trNotes.length > 120) {
      return { error: getTextSafe("expenseNotesTooLong") };
    }

    return {
      value: {
        trID: previousExpense?.trID,
        trDate,
        trCategory,
        trAmount: Number(rawTrAmount),
        trNotes,
      },
    };
  }

  function saveExpense(event) {
    event.preventDefault();
    const transactions = getTransactions();
    const mode = state.activeModeByModule.expense;
    const previousExpense = mode === "edit"
      ? transactions.find((transaction) => String(transaction.trID) === String(state.selectedRecordByModule.expense)) || null
      : null;

    if (mode === "edit" && !previousExpense) {
      setFeedback(getTextSafe("chooseRecordToEdit"));
      return;
    }

    const validation = buildExpensePayload(previousExpense);
    if (validation.error) {
      setFeedback(validation.error);
      return;
    }

    const payload = validation.value;
    let savedExpense;

    if (mode === "edit") {
      const index = transactions.findIndex((transaction) => String(transaction.trID) === String(previousExpense.trID));
      savedExpense = { ...payload, trID: previousExpense.trID };
      transactions[index] = savedExpense;
    } else {
      const trID = getNextTransactionID(transactions);
      savedExpense = { ...payload, trID };
      transactions.push(savedExpense);
      state.selectedRecordByModule.expense = String(trID);
    }

    saveCollection(STORAGE_KEYS.transactions, transactions);
    recordQuickEntryActivity({
      moduleKey: "expenses",
      actionKey: mode === "edit" ? "activityExpenseUpdated" : "activityExpenseCreated",
      entityId: `#${savedExpense.trID}`,
      entityName: savedExpense.trNotes,
      amount: Number(savedExpense.trAmount),
    });
    dispatchDashboardRefresh();
    setFeedback(getTextSafe(mode === "edit" ? "recordUpdated" : "expenseSaved"), "success");
  }

  function bindDynamicEvents() {
    elements.body.querySelectorAll("[data-record-select]").forEach((select) => {
      if (select.dataset.bound === "true") {
        return;
      }

      select.addEventListener("change", (event) => {
        handleRecordSelection(event.currentTarget.dataset.recordSelect, event.currentTarget.value);
      });
      select.dataset.bound = "true";
    });

    elements.body.querySelectorAll("[data-quick-entry-mode]").forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.addEventListener("click", () => switchMode(button.dataset.quickEntryMode));
      button.dataset.bound = "true";
    });

    const inventoryProductSelect = document.getElementById("qe-inventory-product");
    if (inventoryProductSelect && inventoryProductSelect.dataset.bound !== "true") {
      inventoryProductSelect.addEventListener("change", () => {
        syncInventoryCategoryField();
        const products = getProducts();
        const inventoryItems = getInventory();
        const selectedProduct = findProductRecord(products, inventoryProductSelect.value);

        if (selectedProduct && findInventoryRecordByProduct(inventoryItems, selectedProduct)) {
          setFeedback(getTextSafe("inventoryExistsSwitchEdit"));
        } else if (state.feedback.type !== "success") {
          clearFeedback();
        }
      });
      inventoryProductSelect.dataset.bound = "true";
    }

    const orderProductSelect = document.getElementById("qe-order-product");
    if (orderProductSelect && orderProductSelect.dataset.bound !== "true") {
      orderProductSelect.addEventListener("change", updateOrderPriceFromSelection);
      orderProductSelect.dataset.bound = "true";
    }

    const quickEntryProductCategorySelect = document.getElementById("qe-product-category");
    if (quickEntryProductCategorySelect && quickEntryProductCategorySelect.dataset.bound !== "true") {
      quickEntryProductCategorySelect.addEventListener("change", handleQuickEntryProductCategoryChange);
      quickEntryProductCategorySelect.dataset.bound = "true";
    }

    const quickEntryProductNameSelect = document.getElementById("qe-product-name");
    if (quickEntryProductNameSelect && quickEntryProductNameSelect.dataset.bound !== "true") {
      quickEntryProductNameSelect.addEventListener("change", handleQuickEntryProductNameChange);
      quickEntryProductNameSelect.dataset.bound = "true";
    }

    ["qe-order-price", "qe-order-qty", "qe-order-shipping", "qe-order-taxes"].forEach((id) => {
      const field = document.getElementById(id);
      if (field && field.dataset.bound !== "true") {
        field.addEventListener("input", updateOrderTotalField);
        field.dataset.bound = "true";
      }
    });

    document.getElementById("quick-entry-form-product")?.addEventListener("submit", saveProduct);
    document.getElementById("quick-entry-form-inventory")?.addEventListener("submit", saveInventory);
    document.getElementById("quick-entry-form-order")?.addEventListener("submit", saveOrder);
    document.getElementById("quick-entry-form-expense")?.addEventListener("submit", saveExpense);
  }

  function bindStaticEvents() {
    const { overlay, panel, tabs, closeButton } = ensureQuickEntryElements();

    overlay.addEventListener("click", closeQuickEntry);
    closeButton.addEventListener("click", closeQuickEntry);
    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quick-entry-tab]");
      if (!button) {
        return;
      }

      switchModule(button.dataset.quickEntryTab);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        closeQuickEntry();
      }
    });

    document.addEventListener("languageChanged", () => {
      if (!panel.hidden) {
        renderQuickEntry();
      }
    });
  }

  function initQuickEntry() {
    const trigger = document.getElementById("quick-business-entry-trigger");
    if (!trigger) {
      return;
    }

    ensureQuickEntryElements();
    bindStaticEvents();
    trigger.addEventListener("click", () => openQuickEntry(trigger));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQuickEntry);
  } else {
    initQuickEntry();
  }
})();
