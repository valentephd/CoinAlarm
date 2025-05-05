function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const mainContent = document.getElementById("mainContent");
  if (!sideMenu || !mainContent) return; // Ensure elements exist

  const isExpanded = sideMenu.classList.contains("menu-expanded");

  if (isExpanded) {
    sideMenu.classList.remove("menu-expanded");
    sideMenu.classList.add("menu-compact");
    mainContent.style.marginLeft = "60px"; // Adjust for compact menu
    localStorage.setItem("menuStyle", "compact");
  } else {
    sideMenu.classList.remove("menu-compact");
    sideMenu.classList.add("menu-expanded");
    mainContent.style.marginLeft = "18%"; // Adjust for expanded menu
    localStorage.setItem("menuStyle", "expanded");
  }
}

function initializeMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const mainContent = document.getElementById("mainContent");
  if (!sideMenu || !mainContent) return; // Ensure elements exist

  const savedStyle = localStorage.getItem("menuStyle") || "compact";

  if (savedStyle === "expanded") {
    sideMenu.classList.add("menu-expanded");
    sideMenu.classList.remove("menu-compact");
    mainContent.style.marginLeft = "18%"; // Adjust for expanded menu
  } else {
    sideMenu.classList.add("menu-compact");
    sideMenu.classList.remove("menu-expanded");
    mainContent.style.marginLeft = "60px"; // Adjust for compact menu
  }
}

document.addEventListener("DOMContentLoaded", initializeMenu);
