// ======================================================
// Fichier : Filters.js
// Description : Gère la logique des boutons et des filtres.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ====================================================== 

import { displayProjects } from "./Gallery.js";

// ----------------- Fonction pour nettoyer les catégories -----------------

export function normalizeCategoryName(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

// ----------------- Fonction pour créer les boutons -----------------

export function createButtons(categories) {
  const uniqueCategories = ["Tous", ...categories.map((cat) => cat.name)];

  let btnContainer = document.querySelector(".btn-container");
  const gallery = document.querySelector(".gallery");

  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    document.getElementById("portfolio").insertBefore(btnContainer, gallery);
  }
  btnContainer.innerHTML = "";

  uniqueCategories.forEach((category) => {
    const btn = document.createElement("button");
    const refreshCategory = normalizeCategoryName(category);
    btn.classList.add("btn", `btn-${refreshCategory}`);
    btn.dataset.category = category === "Tous" ? "all" : refreshCategory;
    btn.textContent = category;
    if (category === "Tous") btn.classList.add("active");
    btnContainer.appendChild(btn);
  });
}

// ----------------- Fonction pour gérer les événements des boutons -----------------

export function setUpButtonListeners(projects) {
  const btnContainer = document.querySelector(".btn-container");
  if (!btnContainer) return;

  btnContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const category = e.target.dataset.category;
      filterProjects(category, projects);

      // Supprimer la classe "active" de tous les boutons :
      document.querySelectorAll(".btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Ajouter la classe "active" au bouton cliqué :
      e.target.classList.add("active");
    }
  });
}

// ----------------- Fonction pour filtrer les projets par catégories -----------------

function filterProjects(category, projects) {
  if (category === "all") {
    displayProjects(projects);
  } else {
    const filteredProjects = projects.filter(
      (project) => normalizeCategoryName(project.category.name) === category
    );
    displayProjects(filteredProjects);
  }
}
