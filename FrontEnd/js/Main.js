// ======================================================
// Fichier : Main.js
// Description : Gère l'initialisation de l'application.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Importation des modules API -----------------
import { fetchWorks, fetchCategories } from "./api/galleryApi.js";
import { login, logout } from "./api/authApi.js";

// ----------------- Importation des modules UI -----------------
import { displayProjects } from "./modules/gallery.js";
import { createButtons, setUpButtonListeners } from "./modules/filters.js";
import { clickNavbarLinks } from "./modules/navbar.js";
import { initEditMode } from "./modules/editMode.js";

// ----------------- Initialisation -----------------

async function init() {
  try {
    // Récupération des projets et affichage
    const projects = await fetchWorks();
    displayProjects(projects);

    // Récupération des catégories et création des boutons
    const categories = await fetchCategories();
    createButtons(categories);
    setUpButtonListeners(projects);

    // Navbar et mode édition
    clickNavbarLinks();
    initEditMode(); // active le mode édition si connecté

    console.log("Application initialisée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
