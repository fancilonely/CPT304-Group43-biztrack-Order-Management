function openSidebar() {
  var side = document.getElementById('sidebar');
  side.style.display = (side.style.display === "block") ? "none" : "block";
}

function closeSidebar() {
  document.getElementById('sidebar').style.display = 'none';
}

function openForm() {
  var form = document.getElementById("product-form")
  form.style.display = (form.style.display === "block") ? "none" : "block";
}

function closeForm() {
  document.getElementById("product-form").style.display = "none";
}

let products = [];
const productSortState = {};

function init() {
  const storedProducts = localStorage.getItem("bizTrackProducts");
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    products = [
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
        prodName: "Sweatshirts",
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

    localStorage.setItem("bizTrackProducts", JSON.stringify(products));
  }

  renderProducts(products);
  resetSubmitButtonMode();
}

function resetSubmitButtonMode() {
  const submitBtn = document.getElementById("submitBtn");

  if (!submitBtn) {
    return;
  }

  submitBtn.dataset.mode = "add";
  delete submitBtn.dataset.editingId;
  submitBtn.setAttribute("data-i18n", "add");
  submitBtn.textContent = "Add";
}

function addOrUpdate(event) {
  const submitBtn = document.getElementById("submitBtn");
  const mode = submitBtn.dataset.mode || "add";

  if (mode === "add") {
    newProduct(event);
  } else if (mode === "update") {
    const prodID = submitBtn.dataset.editingId;
    updateProduct(prodID);
  }
}

function newProduct(event) {
  event.preventDefault();

  const prodID = document.getElementById("product-id").value;
  const prodName = document.getElementById("product-name").value;
  const prodDesc = document.getElementById("product-desc").value;
  const prodCat = document.getElementById("product-cat").value;
  const prodPrice = parseFloat(document.getElementById("product-price").value);
  const prodSold = parseInt(document.getElementById("product-sold").value);

  if (isDuplicateID(prodID, null)) {
    alert("Product ID already exists. Please use a unique ID.");
    return;
  }

  const product = {
    prodID,
    prodName,
    prodDesc,
    prodCat,
    prodPrice,
    prodSold,
  };

  products.push(product);

  renderProducts(products);
  localStorage.setItem("bizTrackProducts", JSON.stringify(products));

  document.getElementById("product-form").reset();
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

function renderProducts(products) {
  const prodTableBody = document.getElementById("tableBody");
  prodTableBody.replaceChildren();

  const prodToRender = products;

  prodToRender.forEach(product => {
    const prodRow = document.createElement("tr");
    prodRow.className = "product-row";

    prodRow.dataset.prodID = product.prodID;
    prodRow.dataset.prodName = product.prodName;
    prodRow.dataset.prodDesc = product.prodDesc;
    prodRow.dataset.prodCat = product.prodCat;
    prodRow.dataset.prodPrice = product.prodPrice;
    prodRow.dataset.prodSold = product.prodSold;

    appendTextCell(prodRow, product.prodID);
    appendTextCell(prodRow, product.prodName);
    appendTextCell(prodRow, translateValue(product.prodDesc));
    appendTextCell(prodRow, translateValue(product.prodCat));
    appendTextCell(prodRow, `$${product.prodPrice.toFixed(2)}`);
    appendTextCell(prodRow, product.prodSold);

    const actionCell = appendTextCell(prodRow, "", "action");
    actionCell.appendChild(createActionButton(
      `Edit product ${product.prodID}`,
      "edit-icon fa-solid fa-pen-to-square",
      () => editRow(product.prodID)
    ));
    actionCell.appendChild(createActionButton(
      `Delete product ${product.prodID}`,
      "delete-icon fas fa-trash-alt",
      () => deleteProduct(product.prodID)
    ));

    prodTableBody.appendChild(prodRow);
  });
}

function editRow(prodID) {
  const productToEdit = products.find(product => product.prodID === prodID);

  document.getElementById("product-id").value = productToEdit.prodID;
  document.getElementById("product-name").value = productToEdit.prodName;
  document.getElementById("product-desc").value = productToEdit.prodDesc;
  document.getElementById("product-cat").value = productToEdit.prodCat;
  document.getElementById("product-price").value = productToEdit.prodPrice;
  document.getElementById("product-sold").value = productToEdit.prodSold;

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.dataset.mode = "update";
  submitBtn.dataset.editingId = prodID;
  submitBtn.setAttribute("data-i18n", "update");
  submitBtn.textContent = "Update";

  document.getElementById("product-form").style.display = "block";
}

function deleteProduct(prodID) {
  const indexToDelete = products.findIndex(product => product.prodID === prodID);

  if (indexToDelete !== -1) {
    products.splice(indexToDelete, 1);

    localStorage.setItem("bizTrackProducts", JSON.stringify(products));

    renderProducts(products);
  }
}

function updateProduct(prodID) {
  const indexToUpdate = products.findIndex(product => product.prodID === prodID);

  if (indexToUpdate !== -1) {
    const updatedProduct = {
      prodID: document.getElementById("product-id").value,
      prodName: document.getElementById("product-name").value,
      prodDesc: document.getElementById("product-desc").value,
      prodCat: document.getElementById("product-cat").value,
      prodPrice: parseFloat(document.getElementById("product-price").value),
      prodSold: parseInt(document.getElementById("product-sold").value),
    };

    if (isDuplicateID(updatedProduct.prodID, prodID)) {
      alert("Product ID already exists. Please use a unique ID.");
      return;
    }

    products[indexToUpdate] = updatedProduct;

    localStorage.setItem("bizTrackProducts", JSON.stringify(products));

    renderProducts(products);

    document.getElementById("product-form").reset();
    resetSubmitButtonMode();
  }
}

function isDuplicateID(prodID, currentID) {
  return products.some(product => product.prodID === prodID && product.prodID !== currentID);
}

function sortTable(column, triggerButton) {
  const tbody = document.getElementById("tableBody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const sortKey = column;

  const isNumeric = column === "prodPrice" || column === "prodSold";

  productSortState[sortKey] = productSortState[sortKey] === "asc" ? "desc" : "asc";
  const direction = productSortState[sortKey];

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

function performSearch() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll(".product-row");

  rows.forEach(row => {
    const visible = row.innerText.toLowerCase().includes(searchInput);
    row.style.display = visible ? "table-row" : "none";
  });
}

function exportToCSV() {
  const productsToExport = products.map(product => {
    return {
      prodID: product.prodID,
      prodName: product.prodName,
      prodDesc: product.prodDesc,
      prodCategory: product.prodCat,
      prodPrice: product.prodPrice.toFixed(2),
      QtySold: product.prodSold,
    };
  });

  const csvContent = generateCSV(productsToExport);

  const blob = new Blob([csvContent], { type: 'text/csv' });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'biztrack_product_table.csv';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  let stringValue = String(value);

  // Prevent CSV formula injection when opened in spreadsheet tools.
  if (/^[=+\-@]/.test(stringValue)) {
    stringValue = "'" + stringValue;
  }

  // Escape double quotes and wrap every value in quotes to preserve commas/new lines.
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function generateCSV(data) {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]).map(escapeCSVValue).join(",");
  const rows = data.map(row =>
    Object.values(row).map(escapeCSVValue).join(",")
  );

  return `${headers}\n${rows.join("\n")}`;
}

document.addEventListener("languageChanged", () => {
  renderProducts(products);
});

init();