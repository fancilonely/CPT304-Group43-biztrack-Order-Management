let inventory = [];
const inventorySortState = {};
const INVENTORY_STORAGE_KEY = "bizTrackInventory";
const PRODUCTS_STORAGE_KEY = "bizTrackProducts";

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

function getStoredProducts() {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

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

function getStoredInventory() {
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

function getProductsByCategory(products) {
    return products.reduce((groups, product) => {
        const category = product.prodCat || "";

        if (!category) {
            return groups;
        }

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(product);
        return groups;
    }, {});
}

function findProductRecord(productValue, productNameFallback = "") {
    const products = getStoredProducts();

    return products.find((product) => {
        if (product.prodID && product.prodID === productValue) {
            return true;
        }

        return product.prodName === productValue || product.prodName === productNameFallback;
    }) || null;
}

function hasInventoryRecordForProduct(product, inventoryItems) {
    return inventoryItems.some((item) => {
        if (product.prodID && item.productID) {
            return item.productID === product.prodID;
        }

        return item.productName === product.prodName;
    });
}

function getNextInventoryID(inventoryItems) {
    const maxNumericID = inventoryItems.reduce((maxValue, item) => {
        const match = String(item.inventoryID || "").match(/^INV(\d+)$/);

        if (!match) {
            return maxValue;
        }

        return Math.max(maxValue, Number(match[1]));
    }, 0);

    return `INV${String(maxNumericID + 1).padStart(3, "0")}`;
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

function normalizeInventoryItem(item) {
    const matchedProduct = findProductRecord(item.productID, item.productName);
    const stockQuantity = Number(item.stockQuantity) || 0;
    const reorderLevel = Number(item.reorderLevel) || 0;

    return {
        inventoryID: item.inventoryID,
        productID: item.productID || matchedProduct?.prodID || "",
        productName: item.productName || matchedProduct?.prodName || "",
        category: matchedProduct?.prodCat || item.category || "",
        stockQuantity,
        reorderLevel,
        supplier: item.supplier || getText("notAssigned"),
        lastUpdated: item.lastUpdated || new Date().toISOString().slice(0, 10),
        status: calculateInventoryStatus(stockQuantity, reorderLevel),
        autoCreated: item.autoCreated === true || item.supplier === "Not assigned" || item.supplier === getText("notAssigned"),
    };
}

function persistInventory() {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
}

function autoSyncInventoryWithProducts() {
    const products = getStoredProducts();
    const today = new Date().toISOString().slice(0, 10);
    let didCreateRecord = false;

    products.forEach((product) => {
        if (hasInventoryRecordForProduct(product, inventory)) {
            return;
        }

        inventory.push({
            inventoryID: getNextInventoryID(inventory),
            productID: product.prodID || "",
            productName: product.prodName,
            category: product.prodCat || "",
            stockQuantity: 0,
            reorderLevel: 5,
            supplier: "Not assigned",
            lastUpdated: today,
            status: "Out of Stock",
            autoCreated: true,
        });
        didCreateRecord = true;
    });

    if (didCreateRecord) {
        persistInventory();
    }
}

function ensureLegacyProductOption(selectElement, item) {
    const optionValue = item.productID || item.productName;

    if (!optionValue || selectElement.querySelector(`option[value="${CSS.escape(optionValue)}"]`)) {
        return;
    }

    const legacyOption = document.createElement("option");
    legacyOption.value = optionValue;
    legacyOption.textContent = typeof translateValue === "function"
        ? translateValue(item.productName)
        : item.productName;
    legacyOption.dataset.productId = item.productID || "";
    legacyOption.dataset.productName = item.productName;
    legacyOption.dataset.category = item.category || "";
    selectElement.appendChild(legacyOption);
}

function populateInventoryProductOptions(selectedValue = "", selectedName = "") {
    const productSelect = document.getElementById("inventory-product-name");

    if (!productSelect) {
        return;
    }

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.hidden = true;
    placeholder.textContent = getText("chooseInventoryProduct");

    productSelect.replaceChildren(placeholder);

    const groupedProducts = getProductsByCategory(getStoredProducts());

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
            option.dataset.category = product.prodCat || "";
            optgroup.appendChild(option);
        });

        productSelect.appendChild(optgroup);
    });

    if (selectedValue || selectedName) {
        const matchedProduct = findProductRecord(selectedValue, selectedName);
        const valueToSelect = matchedProduct?.prodID || selectedValue || selectedName;

        if (!productSelect.querySelector(`option[value="${CSS.escape(valueToSelect)}"]`) && selectedName) {
            ensureLegacyProductOption(productSelect, {
                productID: selectedValue,
                productName: selectedName,
                category: matchedProduct?.prodCat || "",
            });
        }

        productSelect.value = valueToSelect;
    } else {
        productSelect.selectedIndex = 0;
    }
}

function syncCategoryFromSelectedProduct() {
    const productSelect = document.getElementById("inventory-product-name");
    const categorySelect = document.getElementById("inventory-category");

    if (!productSelect || !categorySelect) {
        return;
    }

    const selectedOption = productSelect.selectedOptions[0];

    if (!selectedOption || !selectedOption.dataset.category) {
        categorySelect.value = "";
        return;
    }

    categorySelect.value = selectedOption.dataset.category;
}

function setInventoryFieldEditability({ isEditing }) {
    const inventoryIdInput = document.getElementById("inventory-id");
    const productSelect = document.getElementById("inventory-product-name");
    const categorySelect = document.getElementById("inventory-category");

    if (!inventoryIdInput || !productSelect || !categorySelect) {
        return;
    }

    inventoryIdInput.disabled = isEditing;
    productSelect.disabled = isEditing;
    categorySelect.disabled = true;
}

function bindInventoryProductSelection() {
    const productSelect = document.getElementById("inventory-product-name");

    if (!productSelect || productSelect.dataset.bound === "true") {
        return;
    }

    productSelect.addEventListener("change", () => {
        syncCategoryFromSelectedProduct();
    });

    productSelect.dataset.bound = "true";
}

function openForm() {
    const form = document.getElementById("inventory-form");

    if (form.classList.contains("is-open")) {
        closeForm();
        return;
    }

    form.reset();
    populateInventoryProductOptions();
    syncCategoryFromSelectedProduct();
    setInventoryFieldEditability({ isEditing: false });
    resetSubmitButtonMode();
    updateInventoryStatusField();
    form.classList.add("is-open");
    form.removeAttribute("inert");
    form.removeAttribute("aria-hidden");
}

function closeForm() {
    const form = document.getElementById("inventory-form");
    form.reset();
    populateInventoryProductOptions();
    syncCategoryFromSelectedProduct();
    setInventoryFieldEditability({ isEditing: false });
    resetSubmitButtonMode();
    updateInventoryStatusField();
    form.classList.remove("is-open");
    form.setAttribute("inert", "");
    form.removeAttribute("aria-hidden");
}

function init() {
    inventory = getStoredInventory().map((item) => normalizeInventoryItem(item));
    autoSyncInventoryWithProducts();
    inventory = inventory.map((item) => normalizeInventoryItem(item));

    populateInventoryProductOptions();
    bindInventoryProductSelection();
    bindInventoryStatusPreview();
    renderInventory(inventory);
    renderInventorySummary();
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

function isDuplicateInventoryProduct(productID, productName, currentID) {
    return inventory.some((item) => {
        if (item.inventoryID === currentID) {
            return false;
        }

        if (productID && item.productID) {
            return item.productID === productID;
        }

        return item.productName === productName;
    });
}

function validateInventoryForm(currentID) {
    const rawInventoryID = document.getElementById("inventory-id").value;
    const productSelect = document.getElementById("inventory-product-name");
    const categorySelect = document.getElementById("inventory-category");
    const rawStockQuantity = document.getElementById("stock-quantity").value;
    const rawReorderLevel = document.getElementById("reorder-level").value;
    const supplier = document.getElementById("supplier").value.trim();
    const lastUpdated = document.getElementById("last-updated").value;
    const inventoryID = normalizeInventoryID(rawInventoryID);

    if (!inventoryID) {
        alert("Inventory ID must be a positive integer. For example, enter 6 to create INV006.");
        return null;
    }

    if (!productSelect.value) {
        alert("Please choose a product.");
        return null;
    }

    const selectedOption = productSelect.selectedOptions[0];
    const matchedProduct = findProductRecord(productSelect.value, selectedOption?.dataset.productName);
    const productID = matchedProduct?.prodID || selectedOption?.dataset.productId || "";
    const productName = matchedProduct?.prodName || selectedOption?.dataset.productName || selectedOption?.textContent || "";
    const category = matchedProduct?.prodCat || selectedOption?.dataset.category || categorySelect.value;

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

    if (isDuplicateInventoryProduct(productID, productName, currentID)) {
        alert(getText("inventoryProductExists"));
        return null;
    }

    const stockQuantity = Number(rawStockQuantity);
    const reorderLevel = Number(rawReorderLevel);
    const normalizedSupplier = supplier === getText("notAssigned") ? "Not assigned" : supplier;

    return {
        inventoryID,
        productID,
        productName,
        category,
        stockQuantity,
        reorderLevel,
        supplier: normalizedSupplier,
        lastUpdated,
        status: calculateInventoryStatus(stockQuantity, reorderLevel),
        autoCreated: normalizedSupplier === "Not assigned",
    };
}

function newInventoryItem() {
    const newItem = validateInventoryForm(null);

    if (!newItem) {
        return;
    }

    inventory.push(newItem);
    persistInventory();
    renderInventory(inventory);
    renderInventorySummary();
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
    persistInventory();
    renderInventory(inventory);
    renderInventorySummary();
    closeForm();
}

function deleteInventoryItem(inventoryID) {
    const indexToDelete = inventory.findIndex((item) => item.inventoryID === inventoryID);

    if (indexToDelete === -1) {
        return;
    }

    showDeleteConfirmation({
        title: getText("confirmDeletion"),
        message: getText("deleteConfirmMessage"),
        confirmText: getText("delete"),
        cancelText: getText("cancel"),
        dangerNote: getText("deleteCannotUndo"),
        onConfirm: () => {
            inventory.splice(indexToDelete, 1);
            persistInventory();
            renderInventory(inventory);
            renderInventorySummary();
        },
    });
}

function editRow(inventoryID) {
    const itemToEdit = inventory.find((item) => item.inventoryID === inventoryID);

    if (!itemToEdit) {
        return;
    }

    const numericInventoryID = String(itemToEdit.inventoryID).replace(/^INV0*/, "") || "0";

    document.getElementById("inventory-id").value = numericInventoryID;
    populateInventoryProductOptions(itemToEdit.productID || itemToEdit.productName, itemToEdit.productName);
    document.getElementById("inventory-category").value = itemToEdit.category;
    document.getElementById("stock-quantity").value = itemToEdit.stockQuantity;
    document.getElementById("reorder-level").value = itemToEdit.reorderLevel;
    document.getElementById("supplier").value = itemToEdit.supplier === "Not assigned" ? getText("notAssigned") : itemToEdit.supplier;
    document.getElementById("last-updated").value = itemToEdit.lastUpdated;

    setInventoryFieldEditability({ isEditing: true });
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

function getInventoryStatusClass(status) {
    if (status === "In Stock") {
        return "in-stock";
    }

    if (status === "Low Stock") {
        return "low-stock";
    }

    return "out-of-stock";
}

function getSupplierDisplayText(item) {
    if (item.supplier === "Not assigned" || item.supplier === getText("notAssigned")) {
        return getText("notAssigned");
    }

    return item.supplier;
}

function renderInventory(items) {
    const inventoryTableBody = document.getElementById("tableBody");
    inventoryTableBody.replaceChildren();

    items.forEach((item) => {
        const inventoryRow = document.createElement("tr");
        inventoryRow.className = "inventory-row";

        inventoryRow.dataset.inventoryID = item.inventoryID;
        inventoryRow.dataset.productID = item.productID || "";
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

        const supplierCell = appendTextCell(inventoryRow, "");
        const supplierText = document.createElement("span");
        supplierText.textContent = getSupplierDisplayText(item);
        supplierText.className = item.autoCreated === true ? "inventory-cell-note" : "";
        supplierCell.appendChild(supplierText);

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

function renderInventorySummary() {
    const totalCount = document.getElementById("inventory-total-count");
    const inStockCount = document.getElementById("inventory-in-stock-count");
    const lowStockCount = document.getElementById("inventory-low-stock-count");
    const outOfStockCount = document.getElementById("inventory-out-of-stock-count");

    if (!totalCount || !inStockCount || !lowStockCount || !outOfStockCount) {
        return;
    }

    const counts = inventory.reduce((summary, item) => {
        summary.total += 1;

        if (item.status === "In Stock") {
            summary.inStock += 1;
        } else if (item.status === "Low Stock") {
            summary.lowStock += 1;
        } else {
            summary.outOfStock += 1;
        }

        return summary;
    }, {
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
    });

    totalCount.textContent = String(counts.total);
    inStockCount.textContent = String(counts.inStock);
    lowStockCount.textContent = String(counts.lowStock);
    outOfStockCount.textContent = String(counts.outOfStock);
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
        [getText("inventoryProduct")]: translateValue(item.productName),
        [getText("inventoryCategory")]: translateValue(item.category),
        [getText("stockQuantity")]: item.stockQuantity,
        [getText("reorderLevel")]: item.reorderLevel,
        [getText("supplier")]: getSupplierDisplayText(item),
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
    const productSelect = document.getElementById("inventory-product-name");
    const selectedOption = productSelect?.selectedOptions?.[0];
    const currentValue = productSelect?.value || "";
    const currentName = selectedOption?.dataset.productName || "";

    populateInventoryProductOptions(currentValue, currentName);
    renderInventory(inventory);
    renderInventorySummary();
    updateInventoryStatusField();

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
    }
});

init();
