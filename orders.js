
function openSidebar() {
    const side = document.getElementById("sidebar");

    if (!side) {
        return;
    }

    const isOpen = window.getComputedStyle(side).display !== "none";
    side.style.display = isOpen ? "none" : "flex";
}

function closeSidebar() {
    document.getElementById('sidebar').style.display = 'none';
}


function openForm() {
    var form = document.getElementById("order-form");

    if (form.style.display === "block") {
        closeForm();
        return;
    }

    form.reset();
    updateOrderDatePlaceholder();
    resetSubmitButtonMode();
    form.style.display = "block";
}

function closeForm() {
    const form = document.getElementById("order-form");
    form.reset();
    updateOrderDatePlaceholder();
    resetSubmitButtonMode();
    form.style.display = "none";
}

let orders = [];
const orderSortState = {};

function updateOrderDatePlaceholder() {
    const dateInput = document.getElementById("order-date");
    if (!dateInput || !dateInput.parentElement) {
        return;
    }

    dateInput.parentElement.dataset.placeholder =
        typeof getText === "function" ? getText("orderDatePlaceholder") : "YYYY-MM-DD";
    dateInput.parentElement.classList.toggle("has-date", Boolean(dateInput.value));
}

function setupOrderDatePlaceholder() {
    const dateInput = document.getElementById("order-date");
    if (!dateInput) {
        return;
    }

    dateInput.addEventListener("input", updateOrderDatePlaceholder);
    dateInput.addEventListener("change", updateOrderDatePlaceholder);
    document.addEventListener("languageChanged", updateOrderDatePlaceholder);
    updateOrderDatePlaceholder();
}

window.onload = function () {
    const storedOrders = localStorage.getItem("bizTrackOrders");
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    } else {
        orders = [
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

        localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    }

    renderOrders(orders);
    resetSubmitButtonMode();
    setupOrderDatePlaceholder();
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
        const orderID = submitBtn.dataset.editingId;
        updateOrder(orderID);
    }
}


function newOrder() {
  const orderID = document.getElementById("order-id").value;
  const orderDate = document.getElementById("order-date").value;
  const itemName = document.getElementById("item-name").value;
  const itemPrice = parseFloat(document.getElementById("item-price").value);
  const qtyBought = parseInt(document.getElementById("qty-bought").value);
  const shipping = parseFloat(document.getElementById("shipping").value);
  const taxes = parseFloat(document.getElementById("taxes").value);
  const orderTotal = ((itemPrice * qtyBought) + shipping + taxes);
  const orderStatus = document.getElementById("order-status").value;

  if (isDuplicateID(orderID, null)) {
    alert("Order ID already exists. Please use a unique ID.");
    return;
  }

  const order = {
    orderID,
    orderDate,
    itemName,
    itemPrice,
    qtyBought,
    shipping,
    taxes,
    orderTotal,
    orderStatus,
  };

  orders.push(order);

  renderOrders(orders);
  localStorage.setItem("bizTrackOrders", JSON.stringify(orders));

  document.getElementById("order-form").reset();
  updateOrderDatePlaceholder();
  resetSubmitButtonMode();
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
        Delivered: "delivered"
    };

    const language = getCurrentLanguage();
    const key = statusKeys[status];

    if (key && translations[language][key]) {
        return translations[language][key];
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


function renderOrders(orders) {
    const orderTableBody = document.getElementById("tableBody");
    orderTableBody.replaceChildren();

    const orderToRender = orders;
    const statusMap = {
        "Pending": "pending",
        "Processing": "processing",
        "Shipped": "shipped",
        "Delivered": "delivered"
    }

    orderToRender.forEach(order => {
      const orderRow = document.createElement("tr");
      orderRow.className = "order-row";

      orderRow.dataset.orderID = order.orderID;
      orderRow.dataset.orderDate = order.orderDate;
      orderRow.dataset.itemName = order.itemName;
      orderRow.dataset.itemPrice = order.itemPrice;
      orderRow.dataset.qtyBought = order.qtyBought;
      orderRow.dataset.shipping = order.shipping;
      orderRow.dataset.taxes = order.taxes;
      orderRow.dataset.orderTotal = order.orderTotal;
      orderRow.dataset.orderStatus = order.orderStatus;

      const formattedPrice = typeof order.itemPrice === 'number' ? `$${order.itemPrice.toFixed(2)}` : '';
      const formattedShipping = typeof order.shipping === 'number' ? `$${order.shipping.toFixed(2)}` : '';
      const formattedTaxes = typeof order.taxes === 'number' ? `$${order.taxes.toFixed(2)}` : '';
      const formattedTotal = typeof order.orderTotal === 'number' ? `$${order.orderTotal.toFixed(2)}` : '';

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
          () => editRow(order.orderID)
      ));
      actionCell.appendChild(createActionButton(
          getActionLabel("deleteOrder", order.orderID),
          "delete-icon fas fa-trash-alt",
          () => deleteOrder(order.orderID)
      ));

      orderTableBody.appendChild(orderRow);
  });
  displayRevenue();
}

function displayRevenue() {
    const resultElement = document.getElementById("total-revenue");

    const totalRevenue = orders
        .reduce((total, order) => total + order.orderTotal, 0);

    const language = getCurrentLanguage();
    resultElement.textContent = `${translations[language].totalRevenue}: $${totalRevenue.toFixed(2)}`;
}

function editRow(orderID) {
    const orderToEdit = orders.find(order => order.orderID === orderID);

    document.getElementById("order-id").value = orderToEdit.orderID;
    document.getElementById("order-date").value = orderToEdit.orderDate;
    document.getElementById("item-name").value = orderToEdit.itemName;
    document.getElementById("item-price").value = orderToEdit.itemPrice;
    document.getElementById("qty-bought").value = orderToEdit.qtyBought;
    document.getElementById("shipping").value = orderToEdit.shipping;
    document.getElementById("taxes").value = orderToEdit.taxes;
    document.getElementById("order-total").value = orderToEdit.orderTotal;
    document.getElementById("order-status").value = orderToEdit.orderStatus;
    updateOrderDatePlaceholder();

    setSubmitButtonMode("update", orderID);

    document.getElementById("order-form").style.display = "block";
}

function deleteOrder(orderID) {
  const indexToDelete = orders.findIndex(order => order.orderID === orderID);

  if (indexToDelete !== -1) {
      orders.splice(indexToDelete, 1);

      localStorage.setItem("bizTrackOrders", JSON.stringify(orders));

      renderOrders(orders);
  }
}

function updateOrder(orderID) {
    const indexToUpdate = orders.findIndex(order => order.orderID === orderID);

    if (indexToUpdate !== -1) {
        const itemPrice = parseFloat(document.getElementById("item-price").value);
        const qtyBought = parseInt(document.getElementById("qty-bought").value);
        const shipping = parseFloat(document.getElementById("shipping").value);
        const taxes = parseFloat(document.getElementById("taxes").value);
        const updatedOrder = {
            orderID: document.getElementById("order-id").value,
            orderDate: document.getElementById("order-date").value,
            itemName: document.getElementById("item-name").value,
            itemPrice: itemPrice,
            qtyBought: qtyBought,
            shipping: shipping,
            taxes: taxes,
            orderTotal: ((itemPrice * qtyBought) + shipping + taxes),
            orderStatus: document.getElementById("order-status").value,
        };

        if (isDuplicateID(updatedOrder.orderID, orderID)) {
            alert("Order ID already exists. Please use a unique ID.");
            return;
        }

        orders[indexToUpdate] = updatedOrder;

        localStorage.setItem("bizTrackOrders", JSON.stringify(orders));

        renderOrders(orders);

        document.getElementById("order-form").reset();
        updateOrderDatePlaceholder();
        resetSubmitButtonMode();
    }
}

function isDuplicateID(orderID, currentID) {
    return orders.some(order => order.orderID === orderID && order.orderID !== currentID);
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
        } else {
            return direction === "asc" ? aValue - bValue : bValue - aValue;
        }
    });

    rows.forEach(row => tbody.removeChild(row));
    sortedRows.forEach(row => tbody.appendChild(row));

    const table = triggerButton.closest("table");
    table.querySelectorAll("th").forEach(th => th.removeAttribute("aria-sort"));
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

    rows.forEach(row => {
        const visible = row.innerText.toLowerCase().includes(searchInput);
        row.style.display = visible ? "table-row" : "none";
    });
}


function exportToCSV() {
    const ordersToExport = orders.map(order => {
        return {
            orderID: order.orderID,
            orderDate: order.orderDate,
            itemName: order.itemName,
            itemPrice: order.itemPrice.toFixed(2),
            qtyBought: order.qtyBought,
            shipping: order.shipping.toFixed(2),
            taxes: order.taxes.toFixed(2),
            orderTotal: order.orderTotal.toFixed(2),
            orderStatus: order.orderStatus,
        };
    });
  
    const csvContent = safeGenerateCSV(ordersToExport);
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
  
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'biztrack_order_table.csv';
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
}


document.addEventListener("languageChanged", () => {
    renderOrders(orders);
    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {
        setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
    }
});
