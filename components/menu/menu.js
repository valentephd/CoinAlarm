function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  if (!sideMenu) return; // Ensure sideMenu exists

  const isExpanded = sideMenu.classList.contains("menu-expanded");

  if (isExpanded) {
    sideMenu.classList.remove("menu-expanded");
    sideMenu.classList.add("menu-compact");
    localStorage.setItem("menuStyle", "compact");
  } else {
    sideMenu.classList.remove("menu-compact");
    sideMenu.classList.add("menu-expanded");
    localStorage.setItem("menuStyle", "expanded");
  }
  
}

function initializeMenu() {
  const sideMenu = document.getElementById("sideMenu");
  if (!sideMenu) return; // Ensure sideMenu exists

  const savedStyle = localStorage.getItem("menuStyle") || "compact";

  if (savedStyle === "expanded") {
    sideMenu.classList.add("menu-expanded");
    sideMenu.classList.remove("menu-compact");
  } else {
    sideMenu.classList.add("menu-compact");
    sideMenu.classList.remove("menu-expanded");
  }
  
}

document.addEventListener("DOMContentLoaded", initializeMenu);
