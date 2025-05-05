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
  const mainContent = document.querySelectorAll("#header, #content, #footer"); // Selecionar header, content e footer
  if (!sideMenu || !mainContent) return;

  const isExpanded = sideMenu.classList.contains("menu-expanded");

  mainContent.forEach(element => {
    if (isExpanded) {
      element.style.marginLeft = window.innerWidth <= 768 ? "25%" : "18%";
    } else {
      element.style.marginLeft = "60px"; // Espaço para o menu contraído
    }
  });
}

window.addEventListener("resize", adjustContentMargin);
document.addEventListener("DOMContentLoaded", initializeMenu);
