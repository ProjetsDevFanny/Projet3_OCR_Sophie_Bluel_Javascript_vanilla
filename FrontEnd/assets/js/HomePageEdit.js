// ********** Modification de la page d'accueil: en mode édition **********

// Fonction générale pour modifier la page d'accueil en mode édition

function editPage() {
  console.log("editPage exécutée");
  // =============== Connexion ===============

  // Récupération du token (si pas de token, on redirige vers HomePage)
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "HomePage.html";
    return;
  }

  // =============== Barre supérieure du mode édition =========================================

  const container = document.querySelector(".container");
  const editionMode = document.createElement("div");
  editionMode.id = "edition-mode";

  // Création contenu barre édition (icône + texte)
  const icone = document.createElement("i");
  icone.classList.add("fa-regular", "fa-pen-to-square");
  editionMode.appendChild(icone);

  const texte = document.createElement("span");
  texte.textContent = "Mode édition";
  editionMode.appendChild(texte);

  // Insérer avant .container (donc juste après <body>)
  if (container && container.parentNode) {
    container.parentNode.insertBefore(editionMode, container);
  } else {
    // Fallback : si .container pas trouvé, insérer en début de body
    document.body.insertBefore(editionMode, document.body.firstChild);
  }

  // =============== Bouton de déconnexion ===============

  const loginOutBtn = document.getElementById("login-out-btn");
  if (loginOutBtn) {
    loginOutBtn.textContent = `Logout`;
  }

  // ====================Bouton "Modifier" pour les projets ====================

  // On crée un observateur (observer), c’est un outil qui surveille le DOM : dès que quelque chose change (un nouvel élément est ajouté par exemple), il déclenche une fonction.

  // ici On observe l'ajout du titre-wrapper puis on crée le bouton modifier,
  const observerModifier = new MutationObserver(() => {
    const portfolio = document.getElementById("portfolio");
    const btnContainer = portfolio?.querySelector(".btn-container");

    if (portfolio && btnContainer) {
      // Création d'une div wrapper (titre-wrapper)
      const titleWrapper = document.createElement("div");
      titleWrapper.classList.add("title-wrapper");

      // Déplacer le h2 dans ce wrapper
      const titleMesProjets = portfolio.querySelector("h2");
      titleWrapper.appendChild(titleMesProjets);

      // Création d'un bouton modifier (contenant l'icone et le texte)
      const modifierBtn = document.createElement("button");
      modifierBtn.classList.add("btn-modifier");

      // Ajout d'un icone dans le bouton
      const icone = document.createElement("i");
      icone.classList.add("fa-regular", "fa-pen-to-square");
      modifierBtn.appendChild(icone);

      // Ajout du texte dans le bouton
      modifierBtn.append("Modifier");

      // Ajouter le titre-wrapper dans le DOM
      titleWrapper.appendChild(modifierBtn);

      // Déplacer le titre-wrapper dans le portfolio
      portfolio.insertBefore(
        titleWrapper,
        portfolio.querySelector(".btn-container")
      );
    }
    // On arrête d'observer après insertion
    observerModifier.disconnect();
  });

  // On lance l'observation du DOM:
  // On demande à MutationObserver de surveiller le document.body
  // voir si des éléments enfants sont ajoutés (childList: true)
  // voir si des éléments enfants sont ajoutés dans les sous-éléments (subtree: true)
  // > Autrement dit, il surveille tout ce qui arrive dans la page, même les éléments injectés plus tard par Gallery.js.
  observerModifier.observe(document.body, { childList: true, subtree: true });

  // =============== Masquage des boutons de filtrages de la galerie ===============

  // l'observateur surveiller l'ajout des boutons (btn), puis les masque
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

  // =============== Déconnexion au clic sur le bouton logout ===============

  const logoutBtn = document.getElementById("login-out-btn");
  // On ajoute un écouteur d'événement sur le bouton de déconnexion
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // On redirige vers la page de connexion
    window.location.href = "HomePage.html";
  });
}
