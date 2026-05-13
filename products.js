
function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) {
    return;
  }

  if (isMobileSidebarMode()) {
    sidebar.classList.add("is-open");
  } else {
    document.body.classList.remove("sidebar-collapsed");
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) {
    return;
  }

  if (isMobileSidebarMode()) {
    sidebar.classList.remove("is-open");
  } else {
    document.body.classList.add("sidebar-collapsed");
  }
}

function isMobileSidebarMode() {
  return window.matchMedia("(max-width: 768px)").matches;
}

window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) {
    return;
  }

  if (!isMobileSidebarMode()) {
    sidebar.classList.remove("is-open");
  }
});


function openForm() {
    var form = document.getElementById("product-form");

    if (form.style.display === "block") {
        closeForm();
        return;
    }

    form.reset();
    resetSubmitButtonMode();
    form.style.display = "block";
}

function closeForm() {
    const form = document.getElementById("product-form");
    form.reset();
    resetSubmitButtonMode();
    form.style.display = "none";
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
    newProduct();
  } else if (mode === "update") {
    const prodID = submitBtn.dataset.editingId;
    updateProduct(prodID);
  }
}

function newProduct() {
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

function getActionLabel(key, id) {
  const label = typeof getText === "function" ? getText(key) : key;
  return `${label} ${id}`;
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
      appendTextCell(prodRow, translateValue(product.prodName));
      appendTextCell(prodRow, translateValue(product.prodDesc));
      appendTextCell(prodRow, translateValue(product.prodCat));
      appendTextCell(prodRow, `$${product.prodPrice.toFixed(2)}`);
      appendTextCell(prodRow, product.prodSold);

      const actionCell = appendTextCell(prodRow, "", "action");
      actionCell.appendChild(createActionButton(
        getActionLabel("editProduct", product.prodID),
        "edit-icon fa-solid fa-pen-to-square",
        () => editRow(product.prodID)
      ));
      actionCell.appendChild(createActionButton(
        getActionLabel("deleteProduct", product.prodID),
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

  setSubmitButtonMode("update", prodID);

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
        [getText("productIDShort")]: product.prodID,
        [getText("productName")]: translateValue(product.prodName),
        [getText("description")]: translateValue(product.prodDesc),
        [getText("category")]: translateValue(product.prodCat),
        [getText("price")]: Number(product.prodPrice).toFixed(2),
        [getText("unitsSoldShort")]: product.prodSold,
      };
  });

  const csvContent = safeGenerateCSV(productsToExport);

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'biztrack_product_table_' + getCurrentLanguage() + '.csv';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

document.addEventListener("languageChanged", () => {
  renderProducts(products);
  const submitBtn = document.getElementById("submitBtn");

  if (submitBtn) {
    setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
  }
});

init();
