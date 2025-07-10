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

  const editionMode = document.getElementById("edition-mode");
  if (editionMode) {
    const icone = document.createElement("i");
    icone.classList.add("fa-regular", "fa-pen-to-square");
    editionMode.appendChild(icone);

    const texte = document.createElement("span");
    texte.textContent = `Mode édition`;
    editionMode.appendChild(texte);
  }

  // =============== Bouton de déconnexion ===============

  const loginOutBtn = document.getElementById("login-out-btn");
  if (loginOutBtn) {
    loginOutBtn.textContent = `Logout`;
  }

  // ====================Bouton "Modifier" pour les projets ====================

  const modifier = document.querySelector("#portfolio>h2");
  if (modifier) {
    const icone = document.createElement("i");
    icone.classList.add("fa-regular", "fa-pen-to-square");
    modifier.appendChild(icone);

    const texte = document.createElement("span");
    texte.textContent = `modifier`;
    modifier.appendChild(texte);
  }

  // =============== Masquage des boutons de filtrages de la galerie ===============

  // On crée un observateur (observer), c’est un outil qui surveille le DOM : dès que quelque chose change (un nouvel élément est ajouté par exemple), il déclenche une fonction.
  const observer = new MutationObserver(() => {
    const btns = document.querySelectorAll(".btn");
    if (btns) {
      btns.forEach((btn) => {
        btn.style.display = "none";
      });
    }
    observer.disconnect(); // on arrête d’observer une fois que c’est supprimé
  });

  // On demande à MutationObserver de surveiller le document.body
  // voir si des éléments enfants sont ajoutés (childList: true)
  // voir si des éléments enfants sont ajoutés dans les sous-éléments (subtree: true)
  // Autrement dit, il surveille tout ce qui arrive dans la page, même les éléments injectés plus tard par Gallery.js.
  observer.observe(document.body, { childList: true, subtree: true });

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
