// ======================================================
// Fichier : filters.js
// Description : Gère la logique des boutons et des filtres.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

import { displayProjects } from "./gallery.js";

// ----------------- Création des boutons -----------------

export function createButtons(categories) {
  const uniqueCategories = [{ id: "all", name: "Tous" }, ...categories];

  let btnContainer = document.querySelector(".btn-container");
  const gallery = document.querySelector(".gallery");

  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    document.getElementById("portfolio").insertBefore(btnContainer, gallery);
  }

  // On vide le conteneur des boutons (pour éviter d'empiler les boutons à appel de la fonction createButtons)
  btnContainer.innerHTML = "";

  uniqueCategories.forEach((category) => {
    const btn = document.createElement("button");
    btn.classList.add("btn");

    // On utilise directement l'id (pour éviter de faire une requête à l'API)
    // On utilise un dataset pour l'événement click par la suite
    btn.dataset.category = category.id;

    // Le texte du bouton
    btn.textContent = category.name;

    // Si c'est le bouton "Tous", on ajoute la classe active
    if (category.id === "all") btn.classList.add("active");

    btnContainer.appendChild(btn);
  });
}

// ----------------- Gestion des événements des boutons -----------------

export function setUpButtonListeners(projectsArray) {
  const btnContainer = document.querySelector(".btn-container");
  if (!btnContainer) return;

  btnContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const category = e.target.dataset.category;
      filterProjects(category, projectsArray);

      // Supprimer la classe "active" de tous les boutons :
      document.querySelectorAll(".btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Ajouter la classe "active" au bouton cliqué :
      e.target.classList.add("active");
    }
  });
}

// ----------------- Filtre des projets par catégories -----------------

function filterProjects(categoryId, projectsArray) {
  if (categoryId === "all") {
    displayProjects(projectsArray);
  } else {
    const filteredProjects = projectsArray.filter(
      (project) => project.category.id === parseInt(categoryId)
    );
    displayProjects(filteredProjects);
  }
}

// Notes personnelles :

// categoryId → l'ID de la catégorie choisie (ex. "1")

// ParseInt (convertir une chaîne de caractère en nombre) = pour comparer la même chose:  project.category.id (nombre = id de la catégorie cherchée dans le tableau projectsArray) avec parseInt(categoryId) (string convertie en nombre).

// => Il faut toujours lui donner en comparaison un nombre, car project.category.id est un nombre.
