// ======================================================
// Fichier : Main.js
// Description : Orchestrateur principal de l'application
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Importation des modules API -----------------
import { fetchWorks, fetchCategories } from "./api/api.js";

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

// Source unique de vérité pour tous les projets
export let projectsArray = [];

async function init() {
  try {
    // Récupération et affichage des données
    projectsArray = await fetchWorks(); // on remplit la source unique
    console.log("ProjectArray contient : ", projectsArray); // petit log de débug (pour savoir ce que l'on récupère)    
    displayProjects(projectsArray); // la gallerie de la Home Page

    // Chargement des catégories
    const categories = await fetchCategories();
    createButtons(categories); // lorsqu'on créer les boutons de filtrage
    setUpButtonListeners(projectsArray); // Gestion des événements des boutons de filtre
    injectCategoriesInSelect(categories); // injections des catégories dans le select de la modale addPhoto

    // Configuration de l'interface utilisateur
    clickNavbarLinks();

    // Activation du mode édition si connecté
    editPage(() => loadModalGallery(projectsArray));
    // On passe projectsArray pour que la modale soit synchronisée
    // () => loadModalGallery(projectsArray) est une fonction anonyme qui n’est exécutée que quand editPage l’appelle.
    // On passe la fonction loadModalGallery() à editPage() ici, (pas d'import : import { loadModalGallery }, dans editPage.js, rend le code plus modulable: on peut y passer d'autres modales si on veut, ça rend editPage() complètement indépendante)
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
    alert("Impossible de charger les données. Merci de réessayer plus tard.");
  }
}

// ----------------- Point d'entrée unique -----------------

// Tous les modules sont initialisés depuis ici pour éviter les conflits
document.addEventListener("DOMContentLoaded", init);
