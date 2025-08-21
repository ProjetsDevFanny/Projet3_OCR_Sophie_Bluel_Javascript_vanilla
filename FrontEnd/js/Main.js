// ======================================================
// Fichier : Main.js
// Description : Orchestrateur principal de l'application
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Importation des modules API -----------------
import { fetchWorks, fetchCategories } from "./api/api.js";
import { login, logout } from "./api/authApi.js";

// ----------------- Importation des modules UI -----------------
import { displayProjects } from "./modules/gallery.js";
import { createButtons, setUpButtonListeners } from "./modules/filters.js";
import { clickNavbarLinks } from "./modules/navbar.js";
import { editPage } from "./modules/editMode.js";
import { loadModalGallery } from "./modules/modals.js";

// ----------------- Initialisation de l'application -----------------

async function init() {
  try {
    console.log("🚀 Initialisation de l'application...");
    
    // 1. Récupération et affichage des données
    console.log("📊 Chargement des projets...");
    const projects = await fetchWorks();
    displayProjects(projects);

    console.log("🏷️ Chargement des catégories...");
    const categories = await fetchCategories();
    createButtons(categories);
    setUpButtonListeners(projects);

    // 2. Configuration de l'interface utilisateur
    console.log("🧭 Configuration de la navigation...");
    clickNavbarLinks();
    
    // 3. Activation du mode édition si connecté
    console.log("✏️ Vérification du mode édition...");
    editPage(() => {
      console.log("📝 Ouverture de la modale d'édition");
      loadModalGallery(projects);
    });

    console.log("✅ Application initialisée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation :", error);
  }
}

// ----------------- Point d'entrée unique -----------------
// Tous les modules sont initialisés depuis ici pour éviter les conflits
document.addEventListener("DOMContentLoaded", init);
