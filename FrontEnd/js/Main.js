// ======================================================
// Fichier : Main.js
// Description : Gère l'initialisation de l'application.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Importation des modules -----------------

import { fetchWorks, fetchCategories } from "./Api.js";
import { displayProjects } from "./Gallery.js";
import { createButtons, setUpButtonListeners } from "./Filters.js";
import { clickNavbarLinks } from "./Navbar.js";
// import { initModal } from "./Modal.js";
// import { editPage } from "./HomePageEdit.js";

// ----------------- Fonction pour initialiser l'application -----------------

async function init() {
  try {
    const projects = await fetchWorks();
    displayProjects(projects);

    const categories = await fetchCategories();
    createButtons(categories);
    setUpButtonListeners(projects);
    clickNavbarLinks();
    console.log("Projets et catégories chargés avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
