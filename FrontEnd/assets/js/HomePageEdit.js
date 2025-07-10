// ********** Modification de la page d'accueil: en mode édition **********

// Fonction générale pour modifier la page d'accueil en mode édition

function editPage() {
  // =============== Connexion ===============

  // Récupération du token (si pas de token, on redirige vers login)
  const token = localStorage.getItem("token");
  if (!token) {
    // Pas connecté, on redirige vers login
    window.location.href = "Login.html";
    return;
  }

  // =============== Barre de mode édition =========================================

  const editionMode = document.getElementById("edition-mode");
  editionMode.textContent = `Mode édition`;

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

  const loginBtn = document.getElementById("login-btn");
  // On ajoute un écouteur d'événement sur le bouton de déconnexion
  loginBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // On redirige vers la page de connexion
    window.location.href = "Login.html";
  });
}

// On attend que le DOM soit totalement chargé et on appelle la fonction editPage
document.addEventListener("DOMContentLoaded", editPage);
