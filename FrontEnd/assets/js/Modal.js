// ****************** Logique de la modale ******************

// Affiche les projets dans la modale

function displayProjectsModal(projectsArray) {
  const modalGallery = document.querySelector(".gallery-edit");
  modalGallery.innerHTML = ""; // On vide la galerie pour éviter d'empiler les projets

  projectsArray.forEach((project) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.innerText = project.title;

    const supprPhotoIcon = document.createElement("i");
    supprPhotoIcon.classList.add("fa-solid", "fa-trash-can", "supprPhotoIcon");
    supprPhotoIcon.dataset.id = project.id;

    // Supprime la photo de l'API au click sur l'icône de suppression (icone poubelle)
    supprPhotoIcon.addEventListener("click", async (e) => {
      const confirmed = confirm("Voulez-vous vraiment supprimer ce projet ?");
      if (!confirmed) return; // Si l'utilisateur clique sur annuler, on arrête tout de suite la fonction avec return.

      const idToDelete = e.target.dataset.id;
      try {
        await deleteProjectFromAPI(idToDelete); // Appel d'une fonction externe qui supprime la photo ciblée, de l'API

        // Mise à jour dynamique : supprime juste l'élément du DOM en local (ici, la figure)
        // -> visuellement plus fluide dans un 1er temps, puis un rechargement complet viendra plus après
        e.target.closest("figure").remove();

        // Recharge les projets dans la page principale et de la modale
        refreshAllProjects(); // Appelle displayProjects() et displayProjectsModal()
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    });

    figure.appendChild(img);
    figure.appendChild(caption);
    figure.appendChild(supprPhotoIcon);
    modalGallery.appendChild(figure);
  });
}

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
    displayProjectsModal(projectsArray);
  } catch (error) {
    console.error("Erreur lors du chargement de la modale :", error);
  }
}

// Suppression d'un projet de l'API
async function deleteProjectFromAPI(projectId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    // OK: projet supprimé
  } else if (response.status === 401) {
    console.error("Non autorisé : token invalide ou manquant.");
  } else if (response.status === 500) {
    console.error("Erreur serveur : suppression impossible.");
  } else {
    console.error("Erreur inconnue : ", response.status);
  }
}

// Rechargement de tous les projets
async function refreshAllProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const updatedProjects = await response.json();

  displayProjects(updatedProjects);
  displayProjectsModal(updatedProjects);
}

// Affiche la modale "Ajout d'une photo"
function loadModalAddPhoto() {
  try {
    const modalAddPhoto = document.querySelector(".modal-add-photo");
    const modalOverlay = document.querySelector(".modal-overlay");
    const closeBtn = container.querySelector(".close-btn");

    // Fermeture de la modale ajout photo au click sur la croix (X)
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modalAddPhoto.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
    }

    // Quand l'utilisateur clique en dehors de la fenêtre modale ajout photo, elle se ferme
    if (modalOverlay) {
      modalOverlay.addEventListener("click", () => {
        modalAddPhoto.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
    }

    // Fermeture de la modale au click sur la touche "Escape"
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modalAddPhoto.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      }
    });

    // Affiche la modale
    modalAddPhoto.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la modale 'ajout photo' :",
      error
    );
  }
}

// ==================================================================

const addPhotoBtn = document.querySelector("#addPhotoBtn");
addPhotoBtn.addEventListener("click", () => {
  loadModalAddPhoto();
});

// Affiche la modale "Ajout d'une photo"
function loadModalAddPhoto() {
  const modalAddPhoto = document.querySelector(".modal-add-photo");
  modalAddPhoto.classList.remove("hidden");
  container.classList.add("hidden");
}

// Fermeture de la modale "Ajout d'une photo"
function closeModalAddPhoto() {
  const modalAddPhoto = document.querySelector(".modal-add-photo");
  modalAddPhoto.classList.add("hidden");
}
