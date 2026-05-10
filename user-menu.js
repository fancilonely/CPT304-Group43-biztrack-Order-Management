function initializeUserMenu() {
  const userPanel = document.querySelector(".user-panel");
  const toggleButton = userPanel?.querySelector(".user-panel-button");
  const userMenu = userPanel?.querySelector(".user-menu");
  const sidebar = document.getElementById("sidebar");

  if (!userPanel || !toggleButton || !userMenu) {
    return;
  }

  function closeUserMenu() {
    toggleButton.setAttribute("aria-expanded", "false");
    userMenu.hidden = true;
  }

  function openUserMenu() {
    toggleButton.setAttribute("aria-expanded", "true");
    userMenu.hidden = false;
  }

  function toggleUserMenu() {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeUserMenu();
    } else {
      openUserMenu();
    }
  }

  function showPlaceholderAlert(action) {
    const translationKey = action === "preferences" ? "preferencesComingSoon" : "dataStorageComingSoon";
    const message = typeof window.getText === "function" ? window.getText(translationKey) : "";
    if (message) {
      window.alert(message);
    }
  }

  toggleButton.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleUserMenu();
  });

  userMenu.addEventListener("click", function (event) {
    const actionButton = event.target.closest("[data-user-action]");
    if (actionButton) {
      event.preventDefault();
      showPlaceholderAlert(actionButton.getAttribute("data-user-action"));
      closeUserMenu();
      return;
    }

    const clickedItem = event.target.closest(".user-menu-item");
    if (clickedItem && !clickedItem.hasAttribute("disabled")) {
      closeUserMenu();
    }
  });

  document.addEventListener("click", function (event) {
    if (!userPanel.contains(event.target)) {
      closeUserMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeUserMenu();
      toggleButton.focus();
    }
  });

  const sidebarObserver = new MutationObserver(function () {
    if (document.body.classList.contains("sidebar-collapsed")) {
      closeUserMenu();
    }

    if (sidebar && !sidebar.classList.contains("is-open") && window.matchMedia("(max-width: 768px)").matches) {
      closeUserMenu();
    }
  });

  sidebarObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  if (sidebar) {
    sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUserMenu);
} else {
  initializeUserMenu();
}
