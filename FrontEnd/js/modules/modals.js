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
  const modalAddPhoto = document.getElementById("modal-add-photo");
  const overlay = document.querySelector(".modal-overlay");

  const closeBtn = modalAddPhoto.querySelector(".close-btn");
  const backBtn = modalAddPhoto.querySelector(".back-btn");
  const addPhotoSubmitBtn = document.getElementById("submit-addPhotoBtn");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
  const photoUploadDiv = document.getElementById("photoUpload");

  closeBtn.onclick = () => closeAllModals();
  backBtn.onclick = async () => {
    // Fermer seulement la modale add-photo
    modalAddPhoto.classList.add("hidden");
    alert(
      "Attention, êtes-vous sûr de vouloir revenir en arrière ? Votre projet risque d'être perdu."
    );
  };

  // Événement du bouton submit
  addPhotoSubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    console.log("🔍 Début de la soumission du formulaire");

    // Debug : vérifier si la modale est ouverte
    console.log("📋 modalAddPhoto:", modalAddPhoto);
    console.log("📋 modalAddPhoto.classList:", modalAddPhoto.classList);

    // Debug : vérifier tous les éléments input dans la modale
    const allInputs = modalAddPhoto.querySelectorAll("input");
    console.log("📋 Tous les inputs dans la modale:", allInputs);

    // Essayer différentes façons de récupérer l'élément image
    let imageInput = document.getElementById("image");
    console.log("📁 imageInput par ID:", imageInput);

    if (!imageInput) {
      imageInput = document.querySelector('input[name="image"]');
      console.log("📁 imageInput par name:", imageInput);
    }
    if (!imageInput) {
      imageInput = document.querySelector('input[type="file"]');
      console.log("📁 imageInput par type:", imageInput);
    }
    if (!imageInput) {
      imageInput = modalAddPhoto.querySelector('input[type="file"]');
      console.log("📁 imageInput par modalAddPhoto:", imageInput);
    }

    console.log("📁 imageInput final:", imageInput);
    console.log("📁 imageInput.files:", imageInput?.files);
    console.log("📁 imageInput.files[0]:", imageInput?.files?.[0]);

    if (!imageInput || !imageInput.files || !imageInput.files[0]) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;

    console.log("📝 Titre:", title);
    console.log("🏷️ Catégorie:", category);

    if (!title || !category) {
      alert("Veuillez remplir tous les champs s.v.p");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageInput.files[0]); // Clé correcte pour l'API
    formData.append("title", title);
    formData.append("category", category); // Variable correcte

    console.log("📦 FormData contenu :");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await addWork(formData);
      alert("Projet ajouté avec succès !");
      closeAllModals();
      refreshAllProjects();
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'ajout du projet");
    }
  });

  // Événements pour l'upload de photo
  uploadPhotoBtn.onclick = () => {
    const currentFileInput = document.getElementById("image");
    currentFileInput.click();
  };

  overlay.onclick = () => closeAllModals();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  // Ouvrir la modale AVANT d'attacher les événements
  openModal(modalAddPhoto);

  // Maintenant récupérer fileInput après l'ouverture de la modale
  const fileInput = modalAddPhoto.querySelector("#image");

  // Attacher l'événement change à l'élément fileInput
  if (fileInput) {
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // Préserver l'élément #image
        const imageInput = photoUploadDiv.querySelector("#image");

        photoUploadDiv.innerHTML = "";

        // Recréer l'élément #image
        const newImageInput = document.createElement("input");
        newImageInput.type = "file";
        newImageInput.className = "hidden";
        newImageInput.name = "image";
        newImageInput.id = "image";
        newImageInput.accept = ".jpg,.jpeg,.png";
        newImageInput.files = imageInput.files; // Préserver les fichiers sélectionnés

        const img = document.createElement("img");
        img.id = "uploadedImage";
        img.src = e.target.result;
        img.alt = "Aperçu de la photo choisie";

        photoUploadDiv.appendChild(newImageInput);
        photoUploadDiv.appendChild(img);

        // Réattacher l'événement change au nouvel élément
        newImageInput.onchange = fileInput.onchange;
      };
      reader.readAsDataURL(file);
    };
  }
}

// Bouton "Ajouter une photo"
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
