// ======================================================
// Fichier : HomePageEdit.js
// Description : Modification de la page d'accueil: en mode édition
// Auteur : SIMON Fanny
// Date : 2025-08-20
// ======================================================

// ----------------- Modification de la page d'accueil: en mode édition -----------------

function editPage() {
  console.log("editPage exécutée");

  // ----------------- Vérifie si connecté -----------------

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "HomePage.html";
    return;
  }

  // =====================
  // Fonctions internes
  // =====================

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

  // ----------------- Ajoute le bouton "Modifier" pour la section Portfolio -----------------

  function setupEditButton() {
    const observerModifier = new MutationObserver(() => {
      const portfolio = document.getElementById("portfolio");
      const btnContainer = portfolio?.querySelector(".btn-container");

      if (portfolio && btnContainer) {
        // Crée un wrapper pour le titre
        const titleWrapper = document.createElement("div");
        titleWrapper.classList.add("title-wrapper");

        // Déplace le h2
        const titleMesProjets = portfolio.querySelector("h2");
        if (titleMesProjets) {
          titleWrapper.appendChild(titleMesProjets);
        }

        // Crée le bouton "Modifier"
        const modifierBtn = document.createElement("button");
        modifierBtn.classList.add("btn-modifier");

        const icone = document.createElement("i");
        icone.classList.add("fa-regular", "fa-pen-to-square");
        modifierBtn.appendChild(icone);

        modifierBtn.append("Modifier");
        titleWrapper.appendChild(modifierBtn);

        // Ajoute le tout dans le portfolio
        portfolio.insertBefore(
          titleWrapper,
          portfolio.querySelector(".btn-container")
        );

        // Ouvre la modale au clic
        modifierBtn.addEventListener("click", () => {
          loadModal();
        });

        // Stoppe l'observation
        observerModifier.disconnect();
      }
    });

    // On lance l'observation du DOM:
    // On demande à MutationObserver de surveiller le document.body
    // voir si des éléments enfants sont ajoutés (childList: true)
    // voir si des éléments enfants sont ajoutés dans les sous-éléments (subtree: true)
    // > Autrement dit, il surveille tout ce qui arrive dans la page, même les éléments injectés plus tard par Gallery.js.
    observerModifier.observe(document.body, { childList: true, subtree: true });
  }

  // --- Cache les boutons de filtrage
  function hideFilterButtons() {
    const observerHideBtns = new MutationObserver(() => {
      const btns = document.querySelectorAll(".btn");
      if (btns) {
        btns.forEach((btn) => {
          btn.style.display = "none";
        });
      }
      observerHideBtns.disconnect();
    });
    observerHideBtns.observe(document.body, { childList: true, subtree: true });
  }

  // =====================
  // Exécution des sous-fonctions
  // =====================
  displayBanner();
  updateNavbar();
  setupEditButton();
  hideFilterButtons();
}
