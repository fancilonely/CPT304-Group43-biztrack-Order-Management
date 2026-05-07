
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
}

function addOrUpdate(event) {
  event.preventDefault();
  let type = document.getElementById("submitBtn").textContent;
  if (type === 'Add') {
      newProduct();
  } else if (type === 'Update'){
      const currentID = document.getElementById("product-form").dataset.currentProductId;
      updateProduct(currentID);
  }
}

function clearFormErrors(form) {
  form.querySelectorAll("input, select").forEach(field => field.setCustomValidity(""));
}

function invalidateField(field, message) {
  field.setCustomValidity(message);
}

function getTrimmedValue(id) {
  const field = document.getElementById(id);
  field.value = field.value.trim();
  return field.value;
}

function validateNumberField(id, min, max, label) {
  const field = document.getElementById(id);
  const value = Number(field.value);

  if (!Number.isFinite(value) || value < min || value > max) {
    invalidateField(field, `${label} must be between ${min} and ${max}.`);
    return null;
  }

  return value;
}

function validateIntegerField(id, min, max, label) {
  const field = document.getElementById(id);
  const value = Number(field.value);

  if (!Number.isInteger(value) || value < min || value > max) {
    invalidateField(field, `${label} must be a whole number between ${min} and ${max}.`);
    return null;
  }

  return value;
}

function validateProductForm(currentID) {
  const form = document.getElementById("product-form");
  clearFormErrors(form);

  const prodID = getTrimmedValue("product-id").toUpperCase();
  document.getElementById("product-id").value = prodID;
  const prodName = document.getElementById("product-name").value;
  const prodDesc = getTrimmedValue("product-desc");
  const prodCat = document.getElementById("product-cat").value;
  const prodPrice = validateNumberField("product-price", 0, 10000, "Product price");
  const prodSold = validateIntegerField("product-sold", 0, 100000, "Units sold");

  if (!/^PD\d{3}$/.test(prodID)) {
    invalidateField(document.getElementById("product-id"), "Product ID must use the format PD001.");
  } else if (isDuplicateID(prodID, currentID)) {
    invalidateField(document.getElementById("product-id"), "Product ID already exists. Please use a unique ID.");
  }

  if (prodDesc.length === 0 || prodDesc.length > 80) {
    invalidateField(document.getElementById("product-desc"), "Product description must be 1 to 80 characters.");
  }

  if (!form.checkValidity() || prodPrice === null || prodSold === null) {
    form.reportValidity();
    return null;
  }

  return {
    prodID,
    prodName,
    prodDesc,
    prodCat,
    prodPrice,
    prodSold,
  };
}

function newProduct() {
  const product = validateProductForm(null);

  if (!product) {
    return;
  }

  products.push(product);

  renderProducts(products);
  localStorage.setItem("bizTrackProducts", JSON.stringify(products));

  document.getElementById("product-form").reset();
  delete document.getElementById("product-form").dataset.currentProductId;
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
      appendTextCell(prodRow, product.prodDesc);
      appendTextCell(prodRow, product.prodCat);
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
  document.getElementById("product-form").dataset.currentProductId = prodID;

  document.getElementById("submitBtn").textContent = "Update";

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
        const updatedProduct = validateProductForm(prodID);

        if (!updatedProduct) {
            return;
        }

        products[indexToUpdate] = updatedProduct;

        localStorage.setItem("bizTrackProducts", JSON.stringify(products));

        renderProducts(products);

        document.getElementById("product-form").reset();
        document.getElementById("submitBtn").textContent = "Add";
        delete document.getElementById("product-form").dataset.currentProductId;
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

function generateCSV(data) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(order => Object.values(order).join(','));

  return `${headers}\n${rows.join('\n')}`;
}

init();
