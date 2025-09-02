// ======================================================
// Fichier : Main.js
// Description : Orchestrateur principal de l'application
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Importation des modules API -----------------
import { fetchWorksPublic, fetchCategories } from "./api/api.js";

// ----------------- Importation des modules UI -----------------
import { displayProjects } from "./modules/gallery.js";
import { createButtons, setUpButtonListeners } from "./modules/filters.js";
import { clickNavbarLinks } from "./modules/navbar.js";
import { editPage } from "./modules/editMode.js";
import {
  loadModalGallery,
  injectCategoriesInSelect,
} from "./modules/modals.js";

// ----------------- Initialisation de l'application -----------------

async function init() {
  try {
    // Récupération et affichage des données
    const projectsArray = await fetchWorksPublic();
    displayProjects(projectsArray);

    // Chargement des catégories
    const categories = await fetchCategories();
    createButtons(categories);
    setUpButtonListeners(projectsArray);
    injectCategoriesInSelect(categories);

    // Configuration de l'interface utilisateur
    clickNavbarLinks();

    // Activation du mode édition si connecté
    editPage(() => {
      loadModalGallery();
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
    alert("Impossible de charger les données. Merci de réessayer plus tard.");
  }
}

// ----------------- Point d'entrée unique -----------------

// Tous les modules sont initialisés depuis ici pour éviter les conflits
document.addEventListener("DOMContentLoaded", init);
