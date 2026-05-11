let inventory = [];
const inventorySortState = {};
const INVENTORY_STORAGE_KEY = "bizTrackInventory";

function openForm() {
    const form = document.getElementById("inventory-form");

    if (form.classList.contains("is-open")) {
        closeForm();
        return;
    }

    form.reset();
    resetSubmitButtonMode();
    updateInventoryStatusField();
    form.classList.add("is-open");
    form.removeAttribute("inert");
    form.removeAttribute("aria-hidden");
}

function closeForm() {
    const form = document.getElementById("inventory-form");
    form.reset();
    resetSubmitButtonMode();
    updateInventoryStatusField();
    form.classList.remove("is-open");
    form.setAttribute("inert", "");
    form.removeAttribute("aria-hidden");
}

function init() {
    const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);

    if (storedInventory) {
        inventory = JSON.parse(storedInventory);
    } else {
        inventory = [
            {
                inventoryID: "INV001",
                productName: "Baseball caps",
                category: "Hats",
                stockQuantity: 24,
                reorderLevel: 5,
                supplier: "North Stitch Supply",
                lastUpdated: "2024-05-01",
                status: "In Stock",
            },
            {
                inventoryID: "INV002",
                productName: "Mugs",
                category: "Drinkware",
                stockQuantity: 8,
                reorderLevel: 10,
                supplier: "Ceramic Hub",
                lastUpdated: "2024-05-03",
                status: "Low Stock",
            },
            {
                inventoryID: "INV003",
                productName: "Tote bags",
                category: "Accessories",
                stockQuantity: 0,
                reorderLevel: 6,
                supplier: "Canvas Works",
                lastUpdated: "2024-05-05",
                status: "Out of Stock",
            },
        ];

        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    }

    renderInventory(inventory);
    bindInventoryStatusPreview();
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
        newInventoryItem();
    } else if (mode === "update") {
        updateInventoryItem(submitBtn.dataset.editingId);
    }
}

function isPositiveIntegerString(value) {
    return /^[1-9]\d*$/.test(String(value).trim());
}

function isNonNegativeIntegerString(value) {
    return /^(0|[1-9]\d*)$/.test(String(value).trim());
}

function normalizeInventoryID(rawValue) {
    const trimmed = String(rawValue).trim();

    if (!/^\d+$/.test(trimmed)) {
        return null;
    }

    const numericValue = Number(trimmed);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
        return null;
    }

    return `INV${String(numericValue).padStart(3, "0")}`;
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

function updateInventoryStatusField() {
    const stockQuantityInput = document.getElementById("stock-quantity");
    const reorderLevelInput = document.getElementById("reorder-level");
    const statusInput = document.getElementById("inventory-status");

    if (!stockQuantityInput || !reorderLevelInput || !statusInput) {
        return;
    }

    const rawStockQuantity = stockQuantityInput.value.trim();
    const rawReorderLevel = reorderLevelInput.value.trim();

    if (rawStockQuantity === "" || rawReorderLevel === "") {
        statusInput.value = "";
        return;
    }

    if (!isNonNegativeIntegerString(rawStockQuantity) || !isNonNegativeIntegerString(rawReorderLevel)) {
        statusInput.value = "";
        return;
    }

    const status = calculateInventoryStatus(Number(rawStockQuantity), Number(rawReorderLevel));
    statusInput.value = typeof translateValue === "function" ? translateValue(status) : status;
}

function bindInventoryStatusPreview() {
    const stockQuantityInput = document.getElementById("stock-quantity");
    const reorderLevelInput = document.getElementById("reorder-level");

    if (stockQuantityInput && stockQuantityInput.dataset.bound !== "true") {
        stockQuantityInput.addEventListener("input", updateInventoryStatusField);
        stockQuantityInput.dataset.bound = "true";
    }

    if (reorderLevelInput && reorderLevelInput.dataset.bound !== "true") {
        reorderLevelInput.addEventListener("input", updateInventoryStatusField);
        reorderLevelInput.dataset.bound = "true";
    }
}

function isDuplicateInventoryID(inventoryID, currentID) {
    return inventory.some((item) => item.inventoryID === inventoryID && item.inventoryID !== currentID);
}

function validateInventoryForm(currentID) {
    const rawInventoryID = document.getElementById("inventory-id").value;
    const productName = document.getElementById("inventory-product-name").value;
    const category = document.getElementById("inventory-category").value;
    const rawStockQuantity = document.getElementById("stock-quantity").value;
    const rawReorderLevel = document.getElementById("reorder-level").value;
    const supplier = document.getElementById("supplier").value.trim();
    const lastUpdated = document.getElementById("last-updated").value;
    const inventoryID = normalizeInventoryID(rawInventoryID);

    if (!inventoryID) {
        alert("Inventory ID must be a positive integer. For example, enter 6 to create INV006.");
        return null;
    }

    if (!productName) {
        alert("Please choose a product.");
        return null;
    }

    if (!category) {
        alert("Please choose a category.");
        return null;
    }

    if (!isNonNegativeIntegerString(rawStockQuantity)) {
        alert("Stock quantity must be a whole number of 0 or more.");
        return null;
    }

    if (!isNonNegativeIntegerString(rawReorderLevel)) {
        alert("Reorder level must be a whole number of 0 or more.");
        return null;
    }

    if (!supplier) {
        alert("Supplier is required.");
        return null;
    }

    if (supplier.length > 80) {
        alert("Supplier must be 80 characters or fewer.");
        return null;
    }

    if (!lastUpdated) {
        alert("Last updated date is required.");
        return null;
    }

    if (isDuplicateInventoryID(inventoryID, currentID)) {
        alert("Inventory ID already exists. Please use a unique ID.");
        return null;
    }

    const stockQuantity = Number(rawStockQuantity);
    const reorderLevel = Number(rawReorderLevel);

    return {
        inventoryID,
        productName,
        category,
        stockQuantity,
        reorderLevel,
        supplier,
        lastUpdated,
        status: calculateInventoryStatus(stockQuantity, reorderLevel),
    };
}

function newInventoryItem() {
    const newItem = validateInventoryForm(null);

    if (!newItem) {
        return;
    }

    inventory.push(newItem);
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    renderInventory(inventory);
    closeForm();
}

function updateInventoryItem(inventoryID) {
    const indexToUpdate = inventory.findIndex((item) => item.inventoryID === inventoryID);

    if (indexToUpdate === -1) {
        return;
    }

    const updatedItem = validateInventoryForm(inventoryID);

    if (!updatedItem) {
        return;
    }

    inventory[indexToUpdate] = updatedItem;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    renderInventory(inventory);
    closeForm();
}

function deleteInventoryItem(inventoryID) {
    const indexToDelete = inventory.findIndex((item) => item.inventoryID === inventoryID);

    if (indexToDelete === -1) {
        return;
    }

    inventory.splice(indexToDelete, 1);
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    renderInventory(inventory);
}

function editRow(inventoryID) {
    const itemToEdit = inventory.find((item) => item.inventoryID === inventoryID);

    if (!itemToEdit) {
        return;
    }

    const numericInventoryID = String(itemToEdit.inventoryID).replace(/^INV0*/, "") || "0";

    document.getElementById("inventory-id").value = numericInventoryID;
    document.getElementById("inventory-product-name").value = itemToEdit.productName;
    document.getElementById("inventory-category").value = itemToEdit.category;
    document.getElementById("stock-quantity").value = itemToEdit.stockQuantity;
    document.getElementById("reorder-level").value = itemToEdit.reorderLevel;
    document.getElementById("supplier").value = itemToEdit.supplier;
    document.getElementById("last-updated").value = itemToEdit.lastUpdated;

    setSubmitButtonMode("update", inventoryID);
    updateInventoryStatusField();

    const form = document.getElementById("inventory-form");
    form.classList.add("is-open");
    form.removeAttribute("inert");
    form.removeAttribute("aria-hidden");
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

function getInventoryStatusClass(status) {
    if (status === "In Stock") {
        return "in-stock";
    }

    if (status === "Low Stock") {
        return "low-stock";
    }

    return "out-of-stock";
}

function renderInventory(items) {
    const inventoryTableBody = document.getElementById("tableBody");
    inventoryTableBody.replaceChildren();

    items.forEach((item) => {
        const inventoryRow = document.createElement("tr");
        inventoryRow.className = "inventory-row";

        inventoryRow.dataset.inventoryID = item.inventoryID;
        inventoryRow.dataset.productName = item.productName;
        inventoryRow.dataset.category = item.category;
        inventoryRow.dataset.stockQuantity = item.stockQuantity;
        inventoryRow.dataset.reorderLevel = item.reorderLevel;
        inventoryRow.dataset.supplier = item.supplier;
        inventoryRow.dataset.lastUpdated = item.lastUpdated;
        inventoryRow.dataset.status = item.status;

        appendTextCell(inventoryRow, item.inventoryID);
        appendTextCell(inventoryRow, translateValue(item.productName));
        appendTextCell(inventoryRow, translateValue(item.category));
        appendTextCell(inventoryRow, item.stockQuantity);
        appendTextCell(inventoryRow, item.reorderLevel);
        appendTextCell(inventoryRow, item.supplier);
        appendTextCell(inventoryRow, item.lastUpdated);

        const statusCell = appendTextCell(inventoryRow, "");
        const statusBadge = document.createElement("span");
        statusBadge.className = `inventory-status-badge ${getInventoryStatusClass(item.status)}`;
        statusBadge.textContent = translateValue(item.status);
        statusCell.appendChild(statusBadge);

        const actionCell = appendTextCell(inventoryRow, "", "action");
        actionCell.appendChild(createActionButton(
            getActionLabel("editInventory", item.inventoryID),
            "edit-icon fa-solid fa-pen-to-square",
            () => editRow(item.inventoryID)
        ));
        actionCell.appendChild(createActionButton(
            getActionLabel("deleteInventory", item.inventoryID),
            "delete-icon fas fa-trash-alt",
            () => deleteInventoryItem(item.inventoryID)
        ));

        inventoryTableBody.appendChild(inventoryRow);
    });
}

function sortTable(column, triggerButton) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const isNumeric = column === "stockQuantity" || column === "reorderLevel";

    inventorySortState[column] = inventorySortState[column] === "asc" ? "desc" : "asc";
    const direction = inventorySortState[column];

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

function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll(".inventory-row");

    rows.forEach((row) => {
        const visible = row.innerText.toLowerCase().includes(searchInput);
        row.style.display = visible ? "table-row" : "none";
    });
}

function exportToCSV() {
    const inventoryToExport = inventory.map((item) => ({
        [getText("inventoryIDShort")]: item.inventoryID,
        [getText("productName")]: translateValue(item.productName),
        [getText("inventoryCategory")]: translateValue(item.category),
        [getText("stockQuantity")]: item.stockQuantity,
        [getText("reorderLevel")]: item.reorderLevel,
        [getText("supplier")]: item.supplier,
        [getText("lastUpdated")]: item.lastUpdated,
        [getText("inventoryStatus")]: translateValue(item.status),
    }));

    const csvContent = safeGenerateCSV(inventoryToExport);
    const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `biztrack_inventory_table_${getCurrentLanguage()}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById("searchInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});

document.addEventListener("languageChanged", () => {
    renderInventory(inventory);
    updateInventoryStatusField();

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
    }
});

init();
