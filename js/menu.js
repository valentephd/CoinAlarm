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

  adjustContentMargin();
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

  adjustContentMargin();
}

function adjustContentMargin() {
  const sideMenu = document.getElementById("sideMenu");
  const content = document.getElementById("content");
  if (!sideMenu || !content) return; // Ensure both elements exist

  if (sideMenu.classList.contains("menu-expanded")) {
    content.style.marginLeft = window.innerWidth <= 768 ? "25%" : "18%";
  } else {
    content.style.marginLeft = "60px";
  }
}

window.addEventListener("resize", adjustContentMargin);
document.addEventListener("DOMContentLoaded", initializeMenu);
