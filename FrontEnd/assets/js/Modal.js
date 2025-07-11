// Chargement de la modale

function loadModal() {
  try {
    const container = document.querySelector("#modal");
    const modalOverlay = document.querySelector(".modal-overlay");
    const closeBtn = container.querySelector(".close-btn");

    // Fermeture de la modale au click sur la croix (X)
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        container.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
    }

    // Quand l'utilisateur clique en dehors de la fenêtre modale, elle se ferme
    if (modalOverlay) {
      modalOverlay.addEventListener("click", () => {
        container.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
    }

    // Fermeture de la modale au click sur la touche "Escape"
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        container.classList.add("hidden");
        modalOverlay.classList.add("hidden");

        // Enlève le focus du bouton Modifier si c'est lui qui l'a
        const modifierBtn = document.querySelector(".btn-modifier");
        if (modifierBtn) modifierBtn.blur();
      }
    });
    // Affiche la modale
    container.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  } catch (error) {
    console.error("Erreur lors du chargement de la modale :", error);
  }
}
