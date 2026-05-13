function openForm() {
    const form = document.getElementById("transaction-form");

    if (form.classList.contains("is-open")) {
        closeForm();
        return;
    }

    form.reset();
    resetSubmitButtonMode();
    form.classList.add("is-open");
    form.removeAttribute("inert");
    form.removeAttribute("aria-hidden");
}

function closeForm() {
    const form = document.getElementById("transaction-form");
    form.reset();
    resetSubmitButtonMode();
    form.classList.remove("is-open");
    form.setAttribute("inert", "");
    form.removeAttribute("aria-hidden");
}


let transactions = [];
const financeSortState = {};

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

        localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));
    }
  
    renderTransactions(transactions);
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
        newTransaction();
    } else if (mode === "update") {
        const trId = submitBtn.dataset.editingId;
        updateTransaction(+trId); // convert to number
    }
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

function validateTransactionForm() {
    const trDate = document.getElementById("tr-date").value;
    const trCategory = document.getElementById("tr-category").value;
    const rawTrAmount = document.getElementById("tr-amount").value;
    const trNotes = document.getElementById("tr-notes").value.trim();
    const validCategories = new Set([
        "Rent",
        "Order Fulfillment",
        "Utilities",
        "Supplies",
        "Miscellaneous",
    ]);

    if (!trDate) {
        alert("Expense date is required.");
        return null;
    }

    if (!validCategories.has(trCategory)) {
        alert("Please choose a valid expense category.");
        return null;
    }

    if (!isMoneyString(rawTrAmount)) {
        alert("Expense amount must be between 0.01 and 10000.00.");
        return null;
    }

    if (!trNotes) {
        alert("Notes are required.");
        return null;
    }

    if (trNotes.length > 120) {
        alert("Notes must be 120 characters or fewer.");
        return null;
    }

    return {
        trDate,
        trCategory,
        trAmount: Number(rawTrAmount),
        trNotes,
    };
}


function newTransaction() {
    const validatedTransaction = validateTransactionForm();

    if (!validatedTransaction) {
        return;
    }

    const trID = transactions.length > 0
        ? Math.max(...transactions.map(transaction => Number(transaction.trID))) + 1
        : 1;
    
    const transaction = {
      trID,
      ...validatedTransaction,
    };
    
    transactions.push(transaction);
  
    renderTransactions(transactions);
    localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));
    displayExpenses();
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

    const form = document.getElementById("transaction-form");
    form.classList.add("is-open");
    form.removeAttribute("inert");
    form.removeAttribute("aria-hidden");
}
  
function deleteTransaction(trID) {
    const indexToDelete = transactions.findIndex(transaction => transaction.trID == trID);

    if (indexToDelete !== -1) {
        showDeleteConfirmation({
            title: getText("confirmDeletion"),
            message: getText("deleteConfirmMessage"),
            confirmText: getText("delete"),
            cancelText: getText("cancel"),
            dangerNote: getText("deleteCannotUndo"),
            onConfirm: () => {
                transactions.splice(indexToDelete, 1);
                localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));
                renderTransactions(transactions);
            },
        });
    }
}

  function updateTransaction(trID) {
    const indexToUpdate = transactions.findIndex(transaction => transaction.trID === trID);

    if (indexToUpdate !== -1) {
        const validatedTransaction = validateTransactionForm();

        if (!validatedTransaction) {
            return;
        }

        const updatedTransaction = {
            trID: trID,
            ...validatedTransaction,
        };

        transactions[indexToUpdate] = updatedTransaction;

        localStorage.setItem("bizTrackTransactions", JSON.stringify(transactions));

        renderTransactions(transactions);
        closeForm();
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
            [getText("serialNumber")]: transaction.trID,
            [getText("dateShort")]: transaction.trDate,
            [getText("expenseCategory")]: translateCategory(transaction.trCategory),
            [getText("amountShort")]: Number(transaction.trAmount).toFixed(2),
            [getText("notesShort")]: transaction.trNotes,
        };
    });
  
    const csvContent = safeGenerateCSV(transactionsToExport);
  
    const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });
  
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'biztrack_expense_table_' + getCurrentLanguage() + '.csv';
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
}
document.addEventListener("languageChanged", () => {
    renderTransactions(transactions);
    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {
        setSubmitButtonMode(submitBtn.dataset.mode, submitBtn.dataset.editingId);
    }
});
