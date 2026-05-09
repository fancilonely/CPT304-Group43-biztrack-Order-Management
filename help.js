// SIDEBAR TOGGLE

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
