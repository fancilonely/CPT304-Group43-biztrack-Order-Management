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
