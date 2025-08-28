// ======================================================
// Fichier : modals.js
// Description : Gestion des modales
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

// Import de la fonction displayProjects depuis gallery.js
import { displayProjects } from "./gallery.js";
import { deleteWork, addWork, fetchWorksAdmin } from "../api/api.js";

// ========================== Helpers (fonctions transversales) ==========================

// Ouvre une modale et affiche l’overlay
function openModal(modal) {
  const overlay = document.querySelector(".modal-overlay");
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// Ferme une modale et cache l’overlay
function closeModal(modal) {
  const overlay = document.querySelector(".modal-overlay");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Ferme toutes les modales ouvertes
function closeAllModals() {
  document.querySelectorAll(".modal").forEach((m) => m.classList.add("hidden"));
  document.querySelector(".modal-overlay").classList.add("hidden");
}

// Rechargement de tous les projets (mise à jour après ajout ou suppression)
async function refreshAllProjects() {
  const updatedProjects = await fetchWorksAdmin();
  displayProjects(updatedProjects);
  displayProjectsModal(updatedProjects);
}

// Vider le formulaire d'ajout de photo
function clearForm() {
  const title = document.getElementById("title");
  const categorySelect = document.getElementById("category-select");
  const image = document.getElementById("image");
  const uploadedImage = document.getElementById("uploadedImage");
  const uploadPhotoContainer = document.querySelector(".uploadPhoto-container");

  if (title) title.value = "";
  if (categorySelect) categorySelect.value = "";
  if (image) image.value = "";
  if (uploadedImage) uploadedImage.remove();

  // Réafficher le conteneur d'upload
  if (uploadPhotoContainer) {
    uploadPhotoContainer.style.display = "flex";
  }
}

// ========================== 1ère Modale : Gallery Display ==========================

// Affiche les projets dans la modale Gallery Display
function displayProjectsModal(projectsArray) {
  const galleryEditModal = document.querySelector(".gallery-edit");
  galleryEditModal.innerHTML = "";

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

    // Gestion suppression
    supprPhotoIcon.addEventListener("click", async (e) => {
      const confirmed = confirm("Voulez-vous vraiment supprimer ce projet ?");
      if (!confirmed) return;

      try {
        await deleteWork(e.target.dataset.id);
        e.target.closest("figure").remove();
        refreshAllProjects();
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    });

    figure.append(img, caption, supprPhotoIcon);
    galleryEditModal.appendChild(figure);
  });
}

// Chargement de la modale Gallery Display
export function loadModalGallery(projectsArray) {
  const modalGalleryDisplay = document.getElementById("modalGalleryDisplay");
  const overlay = document.querySelector(".modal-overlay");

  const closeBtn = modalGalleryDisplay.querySelector(".close-btn");
  if (closeBtn) closeBtn.onclick = () => closeModal(modalGalleryDisplay);

  overlay.onclick = () => closeModal(modalGalleryDisplay);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal(modalGalleryDisplay);
  });

  openModal(modalGalleryDisplay);
  displayProjectsModal(projectsArray);
}

// ========================== 2ème Modale : Ajout Photo ==========================

// 1. Ouvrir la modale quand on clique sur le bouton "Ajouter une photo"

const addPhotoBtn = document.querySelector("#addPhotoBtn");
addPhotoBtn.addEventListener("click", () => {
  openAddPhotoModal();
});

// Fonction qui ouvre la modale
function openAddPhotoModal() {
  const modalAddPhoto = document.getElementById("modal-add-photo");

  // Ouvrir la modale
  openModal(modalAddPhoto);

  // On attache les events une seule fois (création d'un dataset qui indique que les events sont attachés)
  if (!modalAddPhoto.dataset.eventsAttached) {
    attachAddPhotoEvents(); // <-- on passe la modalAddPhoto
    modalAddPhoto.dataset.eventsAttached = "true";
  }
}

// 2. Attacher les événements de la modale

function attachAddPhotoEvents() {
  const modalAddPhoto = document.getElementById("modal-add-photo");
  const overlay = document.querySelector(".modal-overlay");

  const closeBtn = modalAddPhoto.querySelector(".close-btn");
  const backBtn = modalAddPhoto.querySelector(".back-btn");
  const addPhotoSubmitBtn = document.getElementById("submit-addPhotoBtn"); // Bouton submit du formulaire
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn"); // Bouton upload photo
  const fileInput = document.getElementById("image"); // Input file pour l'upload de la photo

  // Fermer la modale
  closeBtn.onclick = () => closeAllModals();

  // Retour en arrière
  backBtn.onclick = () => {
    const confirmed = confirm(
      "Etes-vous sûr de vouloir revenir en arrière ?\nValidez votre projet avant, sinon il risque d'être perdu."
    );
    if (!confirmed) return;
    clearForm();
    modalAddPhoto.classList.add("hidden");
  };

  // Fermer si clic sur overlay ou touche Escape
  overlay.onclick = () => closeAllModals();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  // 3. Upload photo → input + aperçu
  uploadPhotoBtn.onclick = () => fileInput.click(); // simulation de clic sur le bouton upload photo (car on ne peut pas cliquer sur l'input file)

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      // Supprimer un ancien aperçu
      const oldPreview = modalAddPhoto.querySelector("#uploadedImage");
      if (oldPreview) oldPreview.remove();

      // Masquer le conteneur d'upload
      const uploadPhotoContainer = modalAddPhoto.querySelector(
        ".uploadPhoto-container"
      );
      if (uploadPhotoContainer) uploadPhotoContainer.style.display = "none";

      // Créer et insérer l’aperçu
      const img = document.createElement("img");
      img.id = "uploadedImage";
      img.src = e.target.result;
      img.alt = "Aperçu de la photo choisie";

      const uploadPhotoDiv = modalAddPhoto.querySelector(".uploadPhoto");
      if (uploadPhotoDiv) uploadPhotoDiv.appendChild(img);
    };
    reader.readAsDataURL(file);

    // Simulation du déploiment des options du select categories sur le chevron
    const selectContainer = document.querySelector(".select-container");
    const categorySelect = document.getElementById("category-select");
    if (selectContainer) {
      const chevron = selectContainer.querySelector("::after");
      chevron.onclick = () => {
        categorySelect.click();
      };
    }
  };

  // Fonction pour vérifier si tous les champs sont remplis et activer le bouton submit (coloration verte)

  function checkFormCompletion() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;
    const imageInput = document.getElementById("image");

    if (imageInput.files[0] && title && category) {
      addPhotoSubmitBtn.classList.add("verified-add-photo-form");
    } else {
      addPhotoSubmitBtn.classList.remove("verified-add-photo-form");
    }
  }

  // Écouter les changements sur les champs
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category-select");

  if (titleInput) {
    titleInput.addEventListener("input", checkFormCompletion);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", checkFormCompletion);
  }

  if (fileInput) {
    fileInput.addEventListener("change", checkFormCompletion);
  }

  // Vérification initiale
  checkFormCompletion();

  // 4. Submit du formulaire → envoi à l’API
  addPhotoSubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Vérification si l'image est sélectionnée
    const imageInput = document.getElementById("image");
    if (!imageInput || !imageInput.files || !imageInput.files[0]) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    // Vérification si le titre et la catégorie sont remplis
    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;
    if (!title || !category) {
      alert("Veuillez remplir tous les champs s.v.p");
      return;
    }

    // Création du FormData
    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", title);
    formData.append("category", category);

    // Ajout du projet à l'API
    try {
      await addWork(formData);
      alert("Projet ajouté avec succès !");
      refreshAllProjects();
      clearForm();
      addPhotoSubmitBtn.classList.remove("verified-add-photo-form");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'ajout du projet");
    }
  });
}

// ========================== Injecter les catégories dans le select ( modal Ajout Photo)==========================

export function injectCategoriesInSelect(categories) {
  const select = document.querySelector("#category-select");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
