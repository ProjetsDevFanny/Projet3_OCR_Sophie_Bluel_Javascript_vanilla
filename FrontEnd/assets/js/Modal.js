// ****************** Logique des modales ******************

// ========================== 1ère Modale : modale Gallery Display ==========================

// Affiche les projets dans la modale Gallery Display

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

// Chargement de la modale Gallery Display
function loadModal() {
  try {
    const modalGalleryDisplay = document.querySelector("#modalGalleryDisplay");
    const modalOverlay = document.querySelector(".modal-overlay");
    const closeBtn = modalGalleryDisplay.querySelector(".close-btn");

    // Fermeture de la modale au click sur la croix (X)
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modalGalleryDisplay.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
    }

    // Quand l'utilisateur clique en dehors de la fenêtre modale Gallery Display, elle se ferme
    if (modalOverlay) {
      modalOverlay.addEventListener("click", () => {
        modalGalleryDisplay.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
    }

    // Fermeture de la modale Gallery Display au click sur la touche "Escape"
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modalGalleryDisplay.classList.add("hidden");
        modalOverlay.classList.add("hidden");

        // Enlève le focus du bouton Modifier si c'est lui qui l'a
        const modifierBtn = document.querySelector(".btn-modifier");
        if (modifierBtn) modifierBtn.blur();
      }
    });

    // Affiche la modale Gallery Display
    modalGalleryDisplay.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
    displayProjectsModal(projectsArray);
  } catch (error) {
    console.error("Erreur lors du chargement de la modale :", error);
  }
}

// Suppression d'un projet de l'API (modale Gallery Display)
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

// Rechargement de tous les projets (modale Gallery Display)
async function refreshAllProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const updatedProjects = await response.json();

  displayProjects(updatedProjects);
  displayProjectsModal(updatedProjects);
}

// ========================== 2ème Modale : modale "Ajout d'une photo" ==========================

// Affiche la nouvelle modale "Ajout d'une photo"
function loadModalAddPhoto() {
  const modalAddPhoto = document.querySelector("#modal-add-photo");
  const modalOverlay = document.querySelector(".modal-overlay");

  if (!modalAddPhoto || !modalOverlay) {
    console.error("Éléments de la modale non trouvés");
    return;
  }

  const closeBtn = modalAddPhoto.querySelector(".close-btn");

  // Fermeture de la modale "ajout photo" au click sur la croix (X)
  closeBtn.addEventListener("click", () => {
    modalAddPhoto.classList.add("hidden");
    modalOverlay.classList.add("hidden");
    modalGalleryDisplay.classList.add("hidden");
  });

  // Fermeture de la modale "ajout photo" au click sur le bouton "Retour"
  const backBtn = modalAddPhoto.querySelector(".back-btn");

  backBtn.addEventListener("click", () => {
    modalAddPhoto.classList.add("hidden");
  });

  // Quand l'utilisateur clique en dehors de la fenêtre modale "ajout photo", elle se ferme
  modalOverlay.addEventListener("click", () => {
    modalAddPhoto.classList.add("hidden");
    modalOverlay.classList.add("hidden");
  });

  // Fermeture de la modale "ajout photo" au click sur la touche "Escape"
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalAddPhoto.classList.add("hidden");
      modalOverlay.classList.add("hidden");
    }
  });

  // Affiche la modale "ajout photo"
  modalAddPhoto.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
}

// ==================================================================

// Ouverture de la modale "Ajout photo" au click sur le btn "Ajouter une photo"
const addPhotoBtn = document.querySelector("#addPhotoBtn");
addPhotoBtn.addEventListener("click", () => {
  console.log("click");
  loadModalAddPhoto();
});

// ========================== Upload de la photo au click sur le bouton "+ Ajouter photo" ==========================

const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const fileInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");

// Ouvrir la fenêtre de sélection de fichier quand on clique sur le bouton "+ Ajouter photo"
uploadPhotoBtn.addEventListener("click", () => {
  fileInput.click(); // Simule le click sur l'input file
});

// Affichage de l'image choisie dans le previewImage (avec l'objet FileReader)

// Quand le contenu du champ "fileInput" change (l'utilisateur a choisi un fichier)...
fileInput.addEventListener("change", () => {
    
  // On récupère le premier fichier choisi (s'il y en a plusieurs, on prend uniquement le premier)
  const file = fileInput.files[0];
  
  // On vérifie qu'un fichier a bien été sélectionné
  if (file) {
      
      // On crée un nouvel objet FileReader qui servira à lire le contenu du fichier
      const reader = new FileReader();
      
      // Quand le fichier a fini d'être lu...
      reader.onload = (e) => {
          // On remplace la source (src) de l'image d'aperçu par le contenu lu
          // e.target.result contient une URL "data:" en base64 qui représente l'image
          previewImage.src = e.target.result;
      };
      
      // On lit le fichier sous forme de DataURL (URL encodée en base64 utilisable dans un <img>)
      reader.readAsDataURL(file);
  }
});
