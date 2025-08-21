// ======================================================
// Fichier : modals.js
// Description : Gestion des modales
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

// Import de la fonction displayProjects depuis gallery.js
import { displayProjects } from "./gallery.js";

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

// ========================== 1ère Modale : Gallery Display ==========================

// Affiche les projets dans la modale Gallery Display
function displayProjectsModal(projectsArray) {
  const modalGallery = document.querySelector(".gallery-edit");
  modalGallery.innerHTML = "";

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
        await deleteProjectFromAPI(e.target.dataset.id);
        e.target.closest("figure").remove();
        refreshAllProjects();
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    });

    figure.append(img, caption, supprPhotoIcon);
    modalGallery.appendChild(figure);
  });
}

// Chargement de la modale Gallery Display
export function loadModalGallery(projectsArray) {
  const modal = document.querySelector("#modalGalleryDisplay");
  const overlay = document.querySelector(".modal-overlay");

  const closeBtn = modal.querySelector(".close-btn");
  if (closeBtn) closeBtn.onclick = () => closeModal(modal);

  overlay.onclick = () => closeModal(modal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal(modal);
  });

  openModal(modal);
  displayProjectsModal(projectsArray);
}

// Suppression d’un projet de l’API
async function deleteProjectFromAPI(projectId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401)
      throw new Error("Non autorisé : token invalide.");
    if (response.status === 500) throw new Error("Erreur serveur.");
    throw new Error(`Erreur inconnue : ${response.status}`);
  }
}

// Rechargement de tous les projets
async function refreshAllProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const updatedProjects = await response.json();
  displayProjects(updatedProjects);
  displayProjectsModal(updatedProjects);
}

// ========================== 2ème Modale : Ajout Photo ==========================

function loadModalAddPhoto(projectsArray) {
  const modal = document.querySelector("#modal-add-photo");
  const overlay = document.querySelector(".modal-overlay");

  const closeBtn = modal.querySelector(".close-btn");
  const backBtn = modal.querySelector(".back-btn");

  closeBtn.onclick = () => closeAllModals();
  backBtn.onclick = () => {
    closeAllModals();
    // Rouvrir la modale galerie avec les projets à jour
    loadModalGallery(projectsArray);
  };

  overlay.onclick = () => closeAllModals();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  openModal(modal);
}

// Bouton "Ajouter une photo"
const addPhotoBtn = document.querySelector("#addPhotoBtn");
addPhotoBtn.addEventListener("click", () => {
  // Récupérer les projets actuels pour les passer à la modale
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((projects) => {
      loadModalAddPhoto(projects);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des projets:", error);
    });
});

// ========================== Upload d’une photo ==========================

const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const fileInput = document.getElementById("image");
const photoUploadDiv = document.getElementById("photoUpload");

uploadPhotoBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    photoUploadDiv.innerHTML = "";
    const img = document.createElement("img");
    img.id = "uploadedImage";
    img.src = e.target.result;
    img.alt = "Aperçu de la photo choisie";
    img.style.maxWidth = "100%";
    photoUploadDiv.appendChild(img);
  };
  reader.readAsDataURL(file);
});

// ========================== Catégories ==========================

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  const uniqueCategories = [
    ...new Set(categories.map((category) => category.name)),
  ];
  console.log(uniqueCategories);
  // TODO: injecter ces catégories dans le <select>
}

fetchCategories();
