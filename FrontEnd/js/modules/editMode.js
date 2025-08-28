// ======================================================
// Fichier : editMode.js
// Description : Gère le mode édition de l'application (fusion HomePageEdit + EditMode)
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

// --------------------- Helpers / Fonctions internes ---------------------

// --- Affiche la bannière "Mode édition"
function displayBanner() {
  const container = document.querySelector(".container");
  const editionMode = document.createElement("div");
  editionMode.id = "edition-mode";

  const icone = document.createElement("i");
  icone.classList.add("fa-regular", "fa-pen-to-square");
  editionMode.appendChild(icone);

  const texte = document.createElement("span");
  texte.textContent = "Mode édition";
  editionMode.appendChild(texte);

  if (container && container.parentNode) {
    container.parentNode.insertBefore(editionMode, container);
  } else {
    document.body.insertBefore(editionMode, document.body.firstChild);
  }
}

// --- Transforme Login → Logout et gère la déconnexion
function updateNavbar() {
  const loginOutBtn = document.getElementById("login-out-btn");
  if (loginOutBtn) {
    loginOutBtn.textContent = "Logout";
    loginOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "HomePage.html";
    });
  }
}

// --- Ajoute le bouton "Modifier" pour la section Portfolio
function setupEditButton(loadModal) {
  const observerModifier = new MutationObserver(() => {
    const portfolio = document.getElementById("portfolio");
    const btnContainer = portfolio?.querySelector(".btn-container");

    if (portfolio && btnContainer) {
      const titleWrapper = document.createElement("div");
      titleWrapper.classList.add("title-wrapper");

      const titleMesProjets = portfolio.querySelector("h2");
      if (titleMesProjets) titleWrapper.appendChild(titleMesProjets);

      const modifierBtn = document.createElement("button");
      modifierBtn.classList.add("btn-modifier");

      const icone = document.createElement("i");
      icone.classList.add("fa-regular", "fa-pen-to-square");
      modifierBtn.appendChild(icone);
      modifierBtn.append("Modifier");

      titleWrapper.appendChild(modifierBtn);
      portfolio.insertBefore(titleWrapper, btnContainer);

      modifierBtn.addEventListener("click", loadModal);

      observerModifier.disconnect();
    }
  });

  observerModifier.observe(document.body, { childList: true, subtree: true });
}

// --- Cache les boutons de filtrage
function hideFilterButtons() {
  const observerHideBtns = new MutationObserver(() => {
    const btns = document.querySelectorAll(".btn-filter");
    btns.forEach((btn) => {
      btn.style.display = "none";
    });
    observerHideBtns.disconnect();
  });
  observerHideBtns.observe(document.body, { childList: true, subtree: true });
}

// --------------------- Export / Fonction principale ---------------------

export function editPage(loadModal) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Ne pas rediriger si on est déjà sur HomePage.html
    return;
  }

  displayBanner();
  hideFilterButtons();
  updateNavbar();
  setupEditButton(loadModal);
}

// --------------------- Note ---------------------
// La fonction editPage() est appelée depuis main.js
// Pas besoin d'un autre DOMContentLoaded ici
