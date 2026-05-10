const SIDEBAR_STATE_KEY = "bizTrackSidebarCollapsed";

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) {
    return;
  }

  if (isMobileSidebarMode()) {
    sidebar.classList.add("is-open");
  } else {
    const isCollapsed = document.body.classList.contains("sidebar-collapsed");
    document.body.classList.toggle("sidebar-collapsed", !isCollapsed);
    localStorage.setItem(SIDEBAR_STATE_KEY, isCollapsed ? "false" : "true");
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
    localStorage.setItem(SIDEBAR_STATE_KEY, "true");
  }
}

function isMobileSidebarMode() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function applyStoredSidebarState() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) {
    return;
  }

  if (isMobileSidebarMode()) {
    sidebar.classList.remove("is-open");
    return;
  }

  const isCollapsed = localStorage.getItem(SIDEBAR_STATE_KEY) === "true";
  document.body.classList.toggle("sidebar-collapsed", isCollapsed);
  sidebar.classList.remove("is-open");
}

window.addEventListener("resize", applyStoredSidebarState);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyStoredSidebarState);
} else {
  applyStoredSidebarState();
}
