
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
    var form = document.getElementById("transaction-form");

    if (form.style.display === "block") {
        closeForm();
        return;
    }

    form.reset();
    resetSubmitButtonMode();
    form.style.display = "block";
}

function closeForm() {
    const form = document.getElementById("transaction-form");
    form.reset();
    resetSubmitButtonMode();
    form.style.display = "none";
}


let transactions = [];
const financeSortState = {};
let serialNumberCounter;

window.onload = function () {
    const storedTransactions = localStorage.getItem("bizTrackTransactions");
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        transactions = [
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

        serialNumberCounter = transactions.length + 1
  
        localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));
    }
  
    renderTransactions(transactions);
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
        newTransaction();
    } else if (mode === "update") {
        const trId = submitBtn.dataset.editingId;
        updateTransaction(+trId); // convert to number
    }
}


function newTransaction() {
    const trDate = document.getElementById("tr-date").value;
    const trCategory = document.getElementById("tr-category").value;
    const trAmount = parseFloat(document.getElementById("tr-amount").value);
    const trNotes = document.getElementById("tr-notes").value;

    serialNumberCounter = transactions.length + 1;
    let trID = serialNumberCounter;
    
    const transaction = {
      trID,
      trDate,
      trCategory,
      trAmount,
      trNotes,
    };
    
    transactions.push(transaction);
  
    renderTransactions(transactions);
    localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));

    serialNumberCounter++;
    displayExpenses();
  
    document.getElementById("transaction-form").reset();
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

function translateCategory(category) {
    const categoryKeys = {
        "Rent": "rent",
        "Order Fulfillment": "orderFulfillment",
        "Utilities": "utilities",
        "Supplies": "supplies",
        "Miscellaneous": "miscellaneous"
    };

    const key = categoryKeys[category];

    if (key) {
        return getText(key);
    }

    return category;
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


function renderTransactions(transactions) {
    const transactionTableBody = document.getElementById("tableBody");
    transactionTableBody.replaceChildren();

    const transactionToRender = transactions;

    transactionToRender.forEach(transaction => {
        const transactionRow = document.createElement("tr");
        transactionRow.className = "transaction-row";

        transactionRow.dataset.trID = transaction.trID;
        transactionRow.dataset.trDate = transaction.trDate;
        transactionRow.dataset.trCategory = transaction.trCategory;
        transactionRow.dataset.trAmount = transaction.trAmount;
        transactionRow.dataset.trNotes = transaction.trNotes;

        const formattedAmount = typeof transaction.trAmount === 'number' ? `$${transaction.trAmount.toFixed(2)}` : '';

        appendTextCell(transactionRow, transaction.trID);
        appendTextCell(transactionRow, transaction.trDate);
        appendTextCell(transactionRow, translateCategory(transaction.trCategory));
        appendTextCell(transactionRow, formattedAmount, "tr-amount");
        appendTextCell(transactionRow, transaction.trNotes);

        const actionCell = appendTextCell(transactionRow, "", "action");
        actionCell.appendChild(createActionButton(
            getActionLabel("editExpense", transaction.trID),
            "edit-icon fa-solid fa-pen-to-square",
            () => editRow(transaction.trID)
        ));
        actionCell.appendChild(createActionButton(
            getActionLabel("deleteExpense", transaction.trID),
            "delete-icon fas fa-trash-alt",
            () => deleteTransaction(transaction.trID)
        ));

        transactionTableBody.appendChild(transactionRow);
  });
  displayExpenses();
}

function displayExpenses() {
    const resultElement = document.getElementById("total-expenses");

    const totalExpenses = transactions
        .reduce((total, transaction) => total + transaction.trAmount,0);

    resultElement.textContent = `${getText("totalExpenses")}: $${totalExpenses.toFixed(2)}`;
}

function editRow(trID) {
    const trToEdit = transactions.find(transaction => transaction.trID == trID);
    
    document.getElementById("tr-id").value = trToEdit.trID;      
    document.getElementById("tr-date").value = trToEdit.trDate;
    document.getElementById("tr-category").value = trToEdit.trCategory;
    document.getElementById("tr-amount").value = trToEdit.trAmount;
    document.getElementById("tr-notes").value = trToEdit.trNotes;
  
    setSubmitButtonMode("update", trID);

    document.getElementById("transaction-form").style.display = "block";
  }
  
function deleteTransaction(trID) {
    const indexToDelete = transactions.findIndex(transaction => transaction.trID == trID);

    if (indexToDelete !== -1) {
        transactions.splice(indexToDelete, 1);

        localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));

        renderTransactions(transactions);
    }
}

  function updateTransaction(trID) {
    const indexToUpdate = transactions.findIndex(transaction => transaction.trID === trID);

    if (indexToUpdate !== -1) {
        const updatedTransaction = {
            trID: trID,
            trDate: document.getElementById("tr-date").value,
            trCategory: document.getElementById("tr-category").value,
            trAmount: parseFloat(document.getElementById("tr-amount").value),
            trNotes: document.getElementById("tr-notes").value,
        };

        transactions[indexToUpdate] = updatedTransaction;

        localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));

        renderTransactions(transactions);

        document.getElementById("transaction-form").reset();
        resetSubmitButtonMode();
    }
}

function sortTable(column, triggerButton) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const sortKey = column;

    const isNumeric = column === "trID" || column === "trAmount";

    financeSortState[sortKey] = financeSortState[sortKey] === "asc" ? "desc" : "asc";
    const direction = financeSortState[sortKey];

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
    const rows = document.querySelectorAll(".transaction-row");

    rows.forEach(row => {
        const visible = row.innerText.toLowerCase().includes(searchInput);
        row.style.display = visible ? "table-row" : "none";
    });
}


function exportToCSV() {
    const transactionsToExport = transactions.map(transaction => {
        return {
            trID: transaction.trID,
            trDate: transaction.trDate,
            trCategory: transaction.trCategory,
            trAmount: transaction.trAmount.toFixed(2),
            trNotes: transaction.trNotes,
        };
    });
  
    const csvContent = generateCSV(transactionsToExport);
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
  
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'biztrack_expense_table.csv';
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
}
  
function generateCSV(data) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(order => Object.values(order).join(','));

    return `${headers}\n${rows.join('\n')}`;
}

document.addEventListener("languageChanged", () => {
    renderTransactions(transactions);
    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {
        setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
    }
});
