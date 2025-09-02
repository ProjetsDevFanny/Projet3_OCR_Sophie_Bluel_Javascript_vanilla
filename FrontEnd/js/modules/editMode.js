// ======================================================
// Fichier : editMode.js
// Description : Gère le mode édition de l'application (transforme HomePageEdit en => EditMode)
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

import { getToken } from "../api/authApi.js";
import { checkTokenExpiration } from "../api/api.js";

// --------------------- Helpers / Fonctions internes ---------------------

// --- Affiche la bannière "Mode édition"
function displayBanner() {
  const container = document.querySelector(".container");
  const editionMode = document.createElement("div");
  editionMode.id = "edition-mode"; // on donne un id à la div

  const icone = document.createElement("i");
  icone.classList.add("fa-regular", "fa-pen-to-square");
  editionMode.appendChild(icone);

  const texte = document.createElement("span");
  texte.textContent = "Mode édition";
  editionMode.appendChild(texte);

  if (container && container.parentNode) {
    // Si la variable 'container' existe ET qu'elle a un parent dans le DOM
    // Alors on insère l'élément 'editionMode' juste avant 'container' dans le DOM
    container.parentNode.insertBefore(editionMode, container);
    // container.parentNode: car si on veut insérer un nouvel élément avant le container, c’est le parent qui doit gérer l’insertion.
  } else {
    // Sinon (si 'container' n'existe pas ou n'a pas de parent)
    // On insère 'editionMode' au tout début du <body>
    document.body.insertBefore(editionMode, document.body.firstChild);
  }
}

// --- Transforme Login → Logout et gère la déconnexion
function updateNavbar() {
  const loginOutBtn = document.getElementById("login-out-btn");
  if (loginOutBtn) {
    loginOutBtn.textContent = "logout";
    loginOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/FrontEnd/pages/login.html";
    });
  }
}

// --- Ajoute le bouton "Modifier" pour la section Portfolio
function setupEditButton(loadModal) {
  const observerModifier = new MutationObserver(() => { // => objet JavaScript qui observe les changements dans le DOM
    const portfolio = document.getElementById("portfolio");
    const btnContainer = portfolio?.querySelector(".btn-container");

    if (portfolio && btnContainer) {
      const modeEditTitleContainer = document.createElement("div");
      modeEditTitleContainer.classList.add("mode-edit-title-container");

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

      modeEditTitleContainer.appendChild(titleWrapper);
      modeEditTitleContainer.appendChild(modifierBtn);
      portfolio.insertBefore(modeEditTitleContainer, btnContainer);

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
  const token = getToken(); // ← Vérification du token, s'il est présent dans le localStorage (stocké lors de la connexion), la page HomePage "se transforme" en Mode édition. (c'est le script JS qui transforme dynamiquement la page en mode édition)
  if (!token) {
    // pas de token → pas de mode édition
    return;
  }

  try {
    checkTokenExpiration(token); // vérifie validité et expiration
    // Si on arrive ici, le token est valide → on active le mode édition :
    displayBanner();
    hideFilterButtons();
    updateNavbar();
    setupEditButton(loadModal);
  } catch (error) {
    console.error("Token invalide ou expiré :", error);
    // Pas besoin de return dans le catch, checkTokenExpiration gère déjà la déconnexion/redirection
  }
}

// --------------------- Note ---------------------

// La fonction editPage() est appelée depuis main.js
// Pas besoin d'un DOMContentLoaded ici
