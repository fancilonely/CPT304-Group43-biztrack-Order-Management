const FORM_MOTION_DURATION = 560;

function getFormShell(form) {
    return form.closest(".form-popup");
}

function revealForm(form) {
    const formShell = getFormShell(form);

    form.removeAttribute("inert");

    window.requestAnimationFrame(() => {
        formShell?.classList.add("is-open");
    });
}

function openForm() {
    const form = document.getElementById("order-form");
    const formShell = getFormShell(form);

    if (formShell?.classList.contains("is-open")) {
        closeForm();
        return;
    }

    form.reset();
    populateOrderProductOptions();
    resetSubmitButtonMode();
    revealForm(form);
}

function closeForm() {
    const form = document.getElementById("order-form");
    const formShell = getFormShell(form);
    const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : FORM_MOTION_DURATION;

    form.reset();
    populateOrderProductOptions();
    resetSubmitButtonMode();
    formShell?.classList.remove("is-open");

    window.setTimeout(() => {
        if (!formShell?.classList.contains("is-open")) {
            form.setAttribute("inert", "");
        }
    }, closeDelay);
}

let orders = [];
const orderSortState = {};
const ORDER_STORAGE_KEY = "bizTrackOrders";
const PRODUCT_STORAGE_KEY = "bizTrackProducts";
const INVENTORY_STORAGE_KEY = "bizTrackInventory";

function getFallbackProducts() {
    return [
        {
            prodID: "PD001",
            prodName: "Baseball caps",
            prodDesc: "Peace embroidered cap",
            prodCat: "Hats",
            prodPrice: 25.00,
            prodSold: 20,
        },
        {
            prodID: "PD002",
            prodName: "Water bottles",
            prodDesc: "Floral lotus printed bottle",
            prodCat: "Drinkware",
            prodPrice: 48.50,
            prodSold: 10,
        },
        {
            prodID: "PD003",
            prodName: "Sweatshirts",
            prodDesc: "Palestine sweater",
            prodCat: "Clothing",
            prodPrice: 17.50,
            prodSold: 70,
        },
        {
            prodID: "PD004",
            prodName: "Posters",
            prodDesc: "Vibes printed poster",
            prodCat: "Home decor",
            prodPrice: 12.00,
            prodSold: 60,
        },
        {
            prodID: "PD005",
            prodName: "Pillow cases",
            prodDesc: "Morrocan print pillow case",
            prodCat: "Accessories",
            prodPrice: 17.00,
            prodSold: 40,
        },
    ];
}

function getFallbackOrders() {
    return [
        {
            orderID: "1001",
            orderDate: "2024-01-05",
            productID: "PD001",
            itemName: "Baseball caps",
            itemPrice: 25.00,
            qtyBought: 2,
            shipping: 2.50,
            taxes: 9.00,
            orderTotal: 61.50,
            orderStatus: "Pending",
            inventoryApplied: false,
        },
        {
            orderID: "1002",
            orderDate: "2024-03-05",
            productID: "PD002",
            itemName: "Water bottles",
            itemPrice: 17.00,
            qtyBought: 3,
            shipping: 3.50,
            taxes: 6.00,
            orderTotal: 60.50,
            orderStatus: "Processing",
            inventoryApplied: false,
        },
        {
            orderID: "1003",
            orderDate: "2024-02-05",
            productID: "",
            itemName: "Tote bags",
            itemPrice: 20.00,
            qtyBought: 4,
            shipping: 2.50,
            taxes: 2.00,
            orderTotal: 84.50,
            orderStatus: "Shipped",
            inventoryApplied: true,
        },
        {
            orderID: "1004",
            orderDate: "2023-01-05",
            productID: "",
            itemName: "Canvas prints",
            itemPrice: 55.00,
            qtyBought: 1,
            shipping: 2.50,
            taxes: 19.00,
            orderTotal: 76.50,
            orderStatus: "Delivered",
            inventoryApplied: true,
        },
        {
            orderID: "1005",
            orderDate: "2024-01-15",
            productID: "",
            itemName: "Beanies",
            itemPrice: 15.00,
            qtyBought: 2,
            shipping: 3.90,
            taxes: 4.00,
            orderTotal: 37.90,
            orderStatus: "Pending",
            inventoryApplied: false,
        },
    ];
}

function getStoredProducts() {
    const storedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (!storedProducts) {
        return getFallbackProducts();
    }

    try {
        const parsedProducts = JSON.parse(storedProducts);
        return Array.isArray(parsedProducts) && parsedProducts.length > 0
            ? parsedProducts
            : getFallbackProducts();
    } catch (error) {
        return getFallbackProducts();
    }
}

function getGroupedProducts() {
    return getStoredProducts().reduce((groups, product) => {
        const category = product.prodCat || "";

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(product);
        return groups;
    }, {});
}

function findProductRecord(productValue, itemNameFallback = "") {
    const products = getStoredProducts();

    return products.find((product) => {
        if (product.prodID && product.prodID === productValue) {
            return true;
        }

        return product.prodName === productValue || product.prodName === itemNameFallback;
    }) || null;
}

function populateOrderProductOptions(selectedValue = "", selectedName = "") {
    const select = document.getElementById("item-name");

    if (!select) {
        return;
    }

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.hidden = true;
    placeholder.textContent = getText("chooseItem");

    select.replaceChildren(placeholder);

    const groupedProducts = getGroupedProducts();

    Object.entries(groupedProducts).forEach(([category, products]) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = typeof translateValue === "function" ? translateValue(category) : category;

        products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.prodID || product.prodName;
            option.textContent = typeof translateValue === "function"
                ? translateValue(product.prodName)
                : product.prodName;
            option.dataset.productId = product.prodID || "";
            option.dataset.productName = product.prodName;
            option.dataset.productPrice = String(product.prodPrice ?? "");
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });

    if (selectedValue || selectedName) {
        const matchedProduct = findProductRecord(selectedValue, selectedName);
        const valueToSelect = matchedProduct?.prodID || selectedValue || selectedName;

        if (!select.querySelector(`option[value="${CSS.escape(valueToSelect)}"]`) && selectedName) {
            const legacyOption = document.createElement("option");
            legacyOption.value = valueToSelect;
            legacyOption.textContent = typeof translateValue === "function"
                ? translateValue(selectedName)
                : selectedName;
            legacyOption.dataset.productId = selectedValue || "";
            legacyOption.dataset.productName = selectedName;
            legacyOption.dataset.productPrice = "";
            select.appendChild(legacyOption);
        }

        select.value = valueToSelect;
    } else {
        select.selectedIndex = 0;
    }
}

function persistOrders() {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function loadInventory() {
    const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);

    if (!storedInventory) {
        return [];
    }

    try {
        const parsedInventory = JSON.parse(storedInventory);
        return Array.isArray(parsedInventory) ? parsedInventory : [];
    } catch (error) {
        return [];
    }
}

function persistInventory(items) {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
}

function isFulfilledStatus(status) {
    return status === "Shipped" || status === "Delivered";
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

function getTodayISODate() {
    return new Date().toISOString().slice(0, 10);
}

function normalizeOrder(order) {
    const matchedProduct = findProductRecord(order.productID, order.itemName);
    const normalizedStatus = order.orderStatus || "Pending";
    const alreadyApplied = order.inventoryApplied === true;

    return {
        orderID: String(order.orderID),
        orderDate: order.orderDate,
        productID: order.productID || matchedProduct?.prodID || "",
        itemName: order.itemName || matchedProduct?.prodName || "",
        itemPrice: Number(order.itemPrice),
        qtyBought: Number(order.qtyBought),
        shipping: Number(order.shipping),
        taxes: Number(order.taxes),
        orderTotal: Number(order.orderTotal),
        orderStatus: normalizedStatus,
        inventoryApplied: alreadyApplied || (order.inventoryApplied == null && isFulfilledStatus(normalizedStatus)),
    };
}

function init() {
    const storedOrders = localStorage.getItem(ORDER_STORAGE_KEY);

    if (storedOrders) {
        try {
            orders = JSON.parse(storedOrders);
        } catch (error) {
            orders = getFallbackOrders();
        }
    } else {
        orders = getFallbackOrders();
    }

    orders = orders.map((order) => normalizeOrder(order));
    persistOrders();

    populateOrderProductOptions();
    renderOrders(orders);
    resetSubmitButtonMode();
    closeForm();
    openFormFromDashboardAction();
}

function openFormFromDashboardAction() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("action") === "add") {
        openForm();
    }
}

function getSubmitButtonText(mode) {
    const language = typeof getCurrentLanguage === "function" ? getCurrentLanguage() : "en";
    const key = mode === "update" ? "update" : "add";

    if (typeof getText === "function") {
        return getText(key);
    }

    if (typeof translations !== "undefined" && translations[language] && translations[language][key]) {
        return translations[language][key];
    }

    return mode === "update" ? "Update" : "Add";
}

function setSubmitButtonMode(mode, editingId) {
    const submitBtn = document.getElementById("submitBtn");

    if (!submitBtn) {
        return;
    }

    const normalizedMode = mode === "update" ? "update" : "add";
    submitBtn.dataset.mode = normalizedMode;
    submitBtn.setAttribute("data-i18n", normalizedMode);
    submitBtn.textContent = getSubmitButtonText(normalizedMode);

    if (normalizedMode === "update") {
        submitBtn.dataset.editingId = editingId;
    } else {
        delete submitBtn.dataset.editingId;
    }
}

function resetSubmitButtonMode() {
    setSubmitButtonMode("add");
}

function addOrUpdate(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const mode = submitBtn.dataset.mode || "add";

    if (mode === "add") {
        newOrder();
    } else if (mode === "update") {
        updateOrder(submitBtn.dataset.editingId);
    }
}

function isPositiveIntegerString(value) {
    return /^[1-9]\d*$/.test(String(value).trim());
}

function isMoneyString(value, { allowZero = false } = {}) {
    const trimmed = String(value).trim();
    const pattern = /^\d+(\.\d{1,2})?$/;

    if (!pattern.test(trimmed)) {
        return false;
    }

    const numberValue = Number(trimmed);

    if (!Number.isFinite(numberValue) || numberValue > 10000) {
        return false;
    }

    return allowZero ? numberValue >= 0 : numberValue > 0;
}

function calculateOrderTotal(itemPrice, qtyBought, shipping, taxes) {
    return (itemPrice * qtyBought) + shipping + taxes;
}

function isDuplicateID(orderID, currentID) {
    return orders.some((order) => order.orderID === orderID && order.orderID !== currentID);
}

function getSelectedOrderProduct() {
    const itemSelect = document.getElementById("item-name");

    if (!itemSelect || !itemSelect.value) {
        return null;
    }

    const selectedOption = itemSelect.selectedOptions[0];
    const matchedProduct = findProductRecord(itemSelect.value, selectedOption?.dataset.productName);

    return {
        productID: matchedProduct?.prodID || selectedOption?.dataset.productId || "",
        productName: matchedProduct?.prodName || selectedOption?.dataset.productName || selectedOption?.textContent || "",
    };
}

function validateOrderForm(currentID) {
    const rawOrderID = document.getElementById("order-id").value;
    const orderDate = document.getElementById("order-date").value;
    const rawItemPrice = document.getElementById("item-price").value;
    const rawQtyBought = document.getElementById("qty-bought").value;
    const rawShipping = document.getElementById("shipping").value;
    const rawTaxes = document.getElementById("taxes").value;
    const orderStatus = document.getElementById("order-status").value;
    const selectedProduct = getSelectedOrderProduct();

    if (!isPositiveIntegerString(rawOrderID)) {
        alert("Order ID must be a positive integer.");
        return null;
    }

    const orderID = String(Number(rawOrderID));

    if (isDuplicateID(orderID, currentID)) {
        alert("Order ID already exists. Please use a unique ID.");
        return null;
    }

    if (!orderDate) {
        alert("Order date is required.");
        return null;
    }

    if (!selectedProduct || !selectedProduct.productName) {
        alert("Please choose an item.");
        return null;
    }

    if (!isMoneyString(rawItemPrice)) {
        alert("Item price must be between 0.01 and 10000.00.");
        return null;
    }

    if (!isPositiveIntegerString(rawQtyBought)) {
        alert("Quantity bought must be a positive integer.");
        return null;
    }

    if (!isMoneyString(rawShipping, { allowZero: true })) {
        alert("Shipping fee must be between 0.00 and 10000.00.");
        return null;
    }

    if (!isMoneyString(rawTaxes, { allowZero: true })) {
        alert("Taxes must be between 0.00 and 10000.00.");
        return null;
    }

    if (!orderStatus) {
        alert("Please choose a status.");
        return null;
    }

    const itemPrice = Number(rawItemPrice);
    const qtyBought = Number(rawQtyBought);
    const shipping = Number(rawShipping);
    const taxes = Number(rawTaxes);
    const orderTotal = calculateOrderTotal(itemPrice, qtyBought, shipping, taxes);

    document.getElementById("order-total").value = orderTotal.toFixed(2);

    return {
        orderID,
        orderDate,
        productID: selectedProduct.productID,
        itemName: selectedProduct.productName,
        itemPrice,
        qtyBought,
        shipping,
        taxes,
        orderTotal,
        orderStatus,
    };
}

function findMatchingInventoryItem(order, inventoryItems) {
    return inventoryItems.find((item) => {
        if (order.productID && item.productID) {
            return item.productID === order.productID;
        }

        return item.productName === order.itemName;
    }) || null;
}

function applyInventoryUpdateForOrder(order, previousOrder) {
    const wasApplied = previousOrder?.inventoryApplied === true;
    const itemChanged = previousOrder
        && (previousOrder.itemName !== order.itemName || previousOrder.qtyBought !== order.qtyBought || previousOrder.productID !== order.productID);

    if (wasApplied && itemChanged) {
        alert(getText("fulfilledOrderLocked"));
        return null;
    }

    const nextOrder = {
        ...order,
        inventoryApplied: wasApplied,
    };

    if (!isFulfilledStatus(order.orderStatus) || wasApplied) {
        return nextOrder;
    }

    const inventoryItems = loadInventory();
    const inventoryItem = findMatchingInventoryItem(order, inventoryItems);

    if (!inventoryItem) {
        alert(getText("inventoryRecordRequired"));
        return null;
    }

    if (Number(inventoryItem.stockQuantity) < order.qtyBought) {
        alert(getText("notEnoughStock"));
        return null;
    }

    inventoryItem.stockQuantity = Number(inventoryItem.stockQuantity) - order.qtyBought;
    inventoryItem.status = calculateInventoryStatus(
        inventoryItem.stockQuantity,
        Number(inventoryItem.reorderLevel) || 0,
    );
    inventoryItem.lastUpdated = getTodayISODate();

    persistInventory(inventoryItems);

    nextOrder.inventoryApplied = true;
    return nextOrder;
}

function newOrder() {
    const order = validateOrderForm(null);

    if (!order) {
        return;
    }

    const finalOrder = applyInventoryUpdateForOrder(order, null);

    if (!finalOrder) {
        return;
    }

    orders.push(finalOrder);
    renderOrders(orders);
    persistOrders();
    closeForm();
}

function appendTextCell(row, value, className) {
    const cell = document.createElement("td");
    if (className) {
        cell.className = className;
    }
    cell.textContent = value;
    row.appendChild(cell);
    return cell;
}

function translateStatus(status) {
    const statusKeys = {
        Pending: "pending",
        Processing: "processing",
        Shipped: "shipped",
        Delivered: "delivered",
    };

    const key = statusKeys[status];

    if (key) {
        return getText(key);
    }

    return status;
}

function createActionButton(label, iconClassName, clickHandler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-button action-button";
    button.setAttribute("aria-label", label);
    button.addEventListener("click", clickHandler);

    const icon = document.createElement("i");
    icon.className = iconClassName;
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);

    return button;
}

function getActionLabel(key, id) {
    const label = typeof getText === "function" ? getText(key) : key;
    return `${label} ${id}`;
}

function removeDeleteConfirmationModal() {
    const existingModal = document.querySelector(".biztrack-modal-overlay");

    if (existingModal) {
        existingModal.remove();
    }

    delete document.body.dataset.deleteModalOpen;
}

function showDeleteConfirmation({
    title,
    message,
    confirmText,
    cancelText,
    dangerNote,
    onConfirm,
}) {
    removeDeleteConfirmationModal();

    const overlay = document.createElement("div");
    overlay.className = "biztrack-modal-overlay";

    const modal = document.createElement("section");
    modal.className = "biztrack-confirm-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const titleId = `delete-confirm-title-${Date.now()}`;
    modal.setAttribute("aria-labelledby", titleId);

    const heading = document.createElement("h3");
    heading.id = titleId;
    heading.textContent = title;

    const bodyText = document.createElement("p");
    bodyText.textContent = message;
    modal.append(heading, bodyText);

    if (dangerNote) {
        const warning = document.createElement("p");
        warning.className = "confirm-warning";
        warning.textContent = dangerNote;
        modal.appendChild(warning);
    }

    const actions = document.createElement("div");
    actions.className = "confirm-actions";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn confirm-cancel";
    cancelButton.textContent = cancelText;

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className = "btn confirm-delete";
    confirmButton.textContent = confirmText;

    actions.append(cancelButton, confirmButton);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.dataset.deleteModalOpen = "true";

    function closeModal() {
        document.removeEventListener("keydown", handleKeydown);
        removeDeleteConfirmationModal();
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    }

    cancelButton.addEventListener("click", closeModal);
    confirmButton.addEventListener("click", () => {
        onConfirm();
        closeModal();
    });
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });
    document.addEventListener("keydown", handleKeydown);

    cancelButton.focus();
}

function renderOrdersSummary() {
    const pendingCount = document.getElementById("orders-pending-count");
    const processingCount = document.getElementById("orders-processing-count");
    const shippedCount = document.getElementById("orders-shipped-count");
    const deliveredCount = document.getElementById("orders-delivered-count");

    if (!pendingCount || !processingCount || !shippedCount || !deliveredCount) {
        return;
    }

    const counts = orders.reduce((summary, order) => {
        if (order.orderStatus === "Pending") {
            summary.pending += 1;
        } else if (order.orderStatus === "Processing") {
            summary.processing += 1;
        } else if (order.orderStatus === "Shipped") {
            summary.shipped += 1;
        } else if (order.orderStatus === "Delivered") {
            summary.delivered += 1;
        }

        return summary;
    }, {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
    });

    pendingCount.textContent = String(counts.pending);
    processingCount.textContent = String(counts.processing);
    shippedCount.textContent = String(counts.shipped);
    deliveredCount.textContent = String(counts.delivered);
}

function renderOrders(orderItems) {
    const orderTableBody = document.getElementById("tableBody");
    orderTableBody.replaceChildren();

    const statusMap = {
        Pending: "pending",
        Processing: "processing",
        Shipped: "shipped",
        Delivered: "delivered",
    };

    orderItems.forEach((order) => {
        const orderRow = document.createElement("tr");
        orderRow.className = "order-row";

        orderRow.dataset.orderID = order.orderID;
        orderRow.dataset.productID = order.productID || "";
        orderRow.dataset.orderDate = order.orderDate;
        orderRow.dataset.itemName = order.itemName;
        orderRow.dataset.itemPrice = order.itemPrice;
        orderRow.dataset.qtyBought = order.qtyBought;
        orderRow.dataset.shipping = order.shipping;
        orderRow.dataset.taxes = order.taxes;
        orderRow.dataset.orderTotal = order.orderTotal;
        orderRow.dataset.orderStatus = order.orderStatus;
        orderRow.dataset.inventoryApplied = String(order.inventoryApplied === true);

        const formattedPrice = typeof order.itemPrice === "number" ? `$${order.itemPrice.toFixed(2)}` : "";
        const formattedShipping = typeof order.shipping === "number" ? `$${order.shipping.toFixed(2)}` : "";
        const formattedTaxes = typeof order.taxes === "number" ? `$${order.taxes.toFixed(2)}` : "";
        const formattedTotal = typeof order.orderTotal === "number" ? `$${order.orderTotal.toFixed(2)}` : "";

        appendTextCell(orderRow, order.orderID);
        appendTextCell(orderRow, order.orderDate);
        appendTextCell(orderRow, translateValue(order.itemName));
        appendTextCell(orderRow, formattedPrice);
        appendTextCell(orderRow, order.qtyBought);
        appendTextCell(orderRow, formattedShipping);
        appendTextCell(orderRow, formattedTaxes);
        appendTextCell(orderRow, formattedTotal, "order-total");

        const statusCell = appendTextCell(orderRow, "");
        const statusWrapper = document.createElement("div");
        statusWrapper.classList.add("status");
        if (statusMap[order.orderStatus]) {
            statusWrapper.classList.add(statusMap[order.orderStatus]);
        }
        const statusText = document.createElement("span");
        statusText.textContent = translateStatus(order.orderStatus);
        statusWrapper.appendChild(statusText);
        statusCell.appendChild(statusWrapper);

        const actionCell = appendTextCell(orderRow, "", "action");
        actionCell.appendChild(createActionButton(
            getActionLabel("editOrder", order.orderID),
            "edit-icon fa-solid fa-pen-to-square",
            () => editRow(order.orderID),
        ));
        actionCell.appendChild(createActionButton(
            getActionLabel("deleteOrder", order.orderID),
            "delete-icon fas fa-trash-alt",
            () => deleteOrder(order.orderID),
        ));

        orderTableBody.appendChild(orderRow);
    });
    displayRevenue();
    renderOrdersSummary();
}

function displayRevenue() {
    const resultElement = document.getElementById("total-revenue");

    const totalRevenue = orders
        .reduce((total, order) => total + order.orderTotal, 0);

    resultElement.textContent = `${getText("totalRevenue")}: $${totalRevenue.toFixed(2)}`;
}

function editRow(orderID) {
    const orderToEdit = orders.find((order) => order.orderID === orderID);

    if (!orderToEdit) {
        return;
    }

    document.getElementById("order-id").value = orderToEdit.orderID;
    document.getElementById("order-date").value = orderToEdit.orderDate;
    populateOrderProductOptions(orderToEdit.productID || orderToEdit.itemName, orderToEdit.itemName);
    document.getElementById("item-price").value = orderToEdit.itemPrice;
    document.getElementById("qty-bought").value = orderToEdit.qtyBought;
    document.getElementById("shipping").value = orderToEdit.shipping;
    document.getElementById("taxes").value = orderToEdit.taxes;
    document.getElementById("order-total").value = orderToEdit.orderTotal;
    document.getElementById("order-status").value = orderToEdit.orderStatus;

    setSubmitButtonMode("update", orderID);

    const form = document.getElementById("order-form");
    revealForm(form);
}

function deleteOrder(orderID) {
    const indexToDelete = orders.findIndex((order) => order.orderID === orderID);

    if (indexToDelete === -1) {
        return;
    }

    showDeleteConfirmation({
        title: getText("confirmDeletion"),
        message: getText("deleteConfirmMessage"),
        confirmText: getText("delete"),
        cancelText: getText("cancel"),
        dangerNote: orders[indexToDelete].inventoryApplied === true
            ? getText("deleteAppliedOrderModalWarning")
            : getText("deleteCannotUndo"),
        onConfirm: () => {
            orders.splice(indexToDelete, 1);
            persistOrders();
            renderOrders(orders);
        },
    });
}

function updateOrder(orderID) {
    const indexToUpdate = orders.findIndex((order) => order.orderID === orderID);

    if (indexToUpdate === -1) {
        return;
    }

    const updatedOrder = validateOrderForm(orderID);

    if (!updatedOrder) {
        return;
    }

    const finalOrder = applyInventoryUpdateForOrder(updatedOrder, orders[indexToUpdate]);

    if (!finalOrder) {
        return;
    }

    orders[indexToUpdate] = finalOrder;
    persistOrders();
    renderOrders(orders);
    closeForm();
}

function sortTable(column, triggerButton) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const sortKey = column;

    const isNumeric = column === "itemPrice" || column === "qtyBought" || column === "shipping" || column === "taxes" || column === "orderTotal";

    orderSortState[sortKey] = orderSortState[sortKey] === "asc" ? "desc" : "asc";
    const direction = orderSortState[sortKey];

    const sortedRows = rows.sort((a, b) => {
        const aValue = isNumeric ? parseFloat(a.dataset[column]) : a.dataset[column];
        const bValue = isNumeric ? parseFloat(b.dataset[column]) : b.dataset[column];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return direction === "asc"
                ? aValue.localeCompare(bValue, undefined, { sensitivity: "base" })
                : bValue.localeCompare(aValue, undefined, { sensitivity: "base" });
        }

        return direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    rows.forEach((row) => tbody.removeChild(row));
    sortedRows.forEach((row) => tbody.appendChild(row));

    const table = triggerButton.closest("table");
    table.querySelectorAll("th").forEach((th) => th.removeAttribute("aria-sort"));
    triggerButton.closest("th").setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
}

document.getElementById("searchInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        performSearch();
    }
});

function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll(".order-row");

    rows.forEach((row) => {
        const visible = row.innerText.toLowerCase().includes(searchInput);
        row.style.display = visible ? "table-row" : "none";
    });
}

function exportToCSV() {
    const ordersToExport = orders.map((order) => ({
        [getText("orderIDShort")]: order.orderID,
        [getText("orderDateShort")]: order.orderDate,
        [getText("itemNameShort")]: translateValue(order.itemName),
        [getText("itemPriceShort")]: Number(order.itemPrice).toFixed(2),
        [getText("qty")]: order.qtyBought,
        [getText("shippingFeeShort")]: Number(order.shipping).toFixed(2),
        [getText("taxesShort")]: Number(order.taxes).toFixed(2),
        [getText("orderTotalShort")]: Number(order.orderTotal).toFixed(2),
        [getText("orderStatusShort")]: translateStatus(order.orderStatus),
    }));

    const csvContent = safeGenerateCSV(ordersToExport);

    const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `biztrack_order_table_${getCurrentLanguage()}.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

document.addEventListener("languageChanged", () => {
    const itemSelect = document.getElementById("item-name");
    const selectedOption = itemSelect?.selectedOptions?.[0];
    const currentValue = itemSelect?.value || "";
    const currentName = selectedOption?.dataset.productName || "";

    populateOrderProductOptions(currentValue, currentName);
    renderOrders(orders);
    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {
        setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
    }
});

init();
