// ======================================================
// Fichier : modals.js
// Description : Gestion des modales
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

// Import de la fonction displayProjects depuis gallery.js
import { displayProjects } from "./gallery.js";
import { deleteWork, addWork, fetchWorks } from "../api/api.js";

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
  const updatedProjects = await fetchWorks();
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

// Chargement de la modale Ajout Photo
function loadModalAddPhoto() {
    // Récupération de la modal et de l'overlay
  const modalAddPhoto = document.getElementById("modal-add-photo");
  const overlay = document.querySelector(".modal-overlay");

  // Récupération des éléments des boutons (close, back, submit du formulaire)
  const closeBtn = modalAddPhoto.querySelector(".close-btn");
  const backBtn = modalAddPhoto.querySelector(".back-btn");
  const addPhotoSubmitBtn = document.getElementById("submit-addPhotoBtn");

  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn"); // Bouton upload photo
  const fileInput = modalAddPhoto.querySelector("#image"); // Input file

  // Événements sur les boutons close, back et submit
  closeBtn.onclick = () => closeAllModals();

  backBtn.onclick = () => {
    const confirmed = confirm(
      "Attention ! Etes-vous sûr de vouloir revenir en arrière ?\nValidez votre projet avant, sinon il risque d'être perdu."
    );
    if (!confirmed) return;
    clearForm();
    modalAddPhoto.classList.add("hidden");
  };

  addPhotoSubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Vérification du remplissage des champs du formulaire "ajout projet" avant l'envoie à l'API
    const imageInput = document.getElementById("image");
    if (!imageInput || !imageInput.files || !imageInput.files[0]) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;

    if (!title || !category) {
      alert("Veuillez remplir tous les champs s.v.p");
      return;
    }

    // Si tous les champs remplis: création FormData : Prépare les données pour l'envoi à l'API
    const formData = new FormData();
    formData.append("image", imageInput.files[0]); // Clé correcte pour l'API
    formData.append("title", title);
    formData.append("category", category); // Variable correcte

    // Envoi des données à l'API
    try {
      await addWork(formData);
      alert("Projet ajouté avec succès !");
      refreshAllProjects();
      clearForm();
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'ajout du projet");
    }
  });

  // Événement sur le bouton upload photo
  uploadPhotoBtn.onclick = () => {
    const currentFileInput = document.getElementById("image");
    currentFileInput.click();
  };

  overlay.onclick = () => closeAllModals();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  // Ouvrir la modale (avant d'attacher les événements)
  openModal(modalAddPhoto);

  // Récupérer l'élément uploadPhotoContainer
  const uploadPhotoContainer = modalAddPhoto.querySelector(
    ".uploadPhoto-container"
  );

  // Gestion de l'aperçu d'image
  if (fileInput) {
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // Supprimer un ancien aperçu s'il existe
        const oldPreview = modalAddPhoto.querySelector("#uploadedImage");
        if (oldPreview) oldPreview.remove();

        // Masquer le conteneur d'upload
        if (uploadPhotoContainer) {
          uploadPhotoContainer.style.display = "none";
        }

        // Créer un nouvel aperçu
        const img = document.createElement("img");
        img.id = "uploadedImage";
        img.src = e.target.result;
        img.alt = "Aperçu de la photo choisie";

        // Ajouter l'aperçu dans la div uploadPhoto
        const uploadPhotoDiv = modalAddPhoto.querySelector(".uploadPhoto");
        if (uploadPhotoDiv) {
          uploadPhotoDiv.appendChild(img);
        }
      };
      reader.readAsDataURL(file);
    };
  }
}

// Bouton "Ajouter une photo" (dans la modal gallery display)
const addPhotoBtn = document.querySelector("#addPhotoBtn");
addPhotoBtn.addEventListener("click", () => {
   loadModalAddPhoto();
});

// catégories dans le select
export function injectCategoriesInSelect(categories) {
  const select = document.querySelector("#category-select");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
