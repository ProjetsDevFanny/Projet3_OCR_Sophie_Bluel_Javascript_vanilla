// ======================================================
// Fichier : filters.js
// Description : Gère la logique des boutons et des filtres.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

import { displayProjects } from "./gallery.js";

// ----------------- Création des boutons -----------------

export function createButtons(categories) {
  // On veut d'abord ajouter la catégories "Tous"
  const seenIds = new Set(); // On créer un Set = collection d'élément unique (pas de doublons)
  const uniqueCategories = [
    { id: "all", name: "Tous" },
    ...categories.filter((cat) => {
      // has : vérifie si l'id de la catégorie est déjà présent: ignore si id déjà rencontré
      if (seenIds.has(cat.id)) return false;
      seenIds.add(cat.id); // sinon, on ajoute l'id au Set (avec la propriété "add")
      return true; // et on garde l'objet
    }),
  ];
  // le spread operator deplie chaque élémént du tableau categories et l'ajoute à la suite dans le nouveau tableau uniqueCategories

  let btnContainer = document.querySelector(".btn-container");
  const gallery = document.querySelector(".gallery");

  // On crée le conteneur s'il n'existe pas
  // => Pour éviter d'empiler les containeurs à boutons à chaque appel de createButtons, on s'assure qu'il n'y en a pas un qui existe déjà, pour en créer un nouveau
  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    document.getElementById("portfolio").insertBefore(btnContainer, gallery); // On insère la "div btn-container" dans l'élément parent "portfolio" juste avant la galerie
  }

  // Si le containeur existe, on vide le vide de ses boutons (pour éviter d'empiler les boutons dans le containeur, à appel de la fonction createButtons)
  btnContainer.innerHTML = "";

  // Création des boutons
  uniqueCategories.forEach((category) => {
    const btn = document.createElement("button");
    btn.classList.add("btn-filter", "style-btn");

    // On utilise directement l'id (pour éviter de faire une requête à l'API à chaque clique sur le bouton)
    // On stocke l'id de la catégorie dans le dataset du bouton pour le filtrage par la suite
    // On utilise un dataset pour l'événement click par la suite
    btn.dataset.category = category.id; // ex = data-category = data-1

    // Le texte du bouton
    btn.textContent = category.name;

    // Si c'est le bouton "Tous", on ajoute la classe active
    if (category.id === "all") btn.classList.add("active");

    btnContainer.appendChild(btn);
  });
}

// ----------------- Gestion des événements des boutons de filtre -----------------

export function setUpButtonListeners(projectsArray) {
  const btnContainer = document.querySelector(".btn-container");
  if (!btnContainer) return; // si butons n'existent pas la fonction s'arrête : empêche les erreurs si la fonction est appelée avant que les boutons ne soient créés.

  btnContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // vérifie que la cible soit bien une balise bouton évite de déclencher la fonction si on clique sur le conteneur
      const category = e.target.dataset.category; // récupère ce qu'on a mis dans le data-category (ex: category = "1")
      filterProjects(category, projectsArray);

      // Supprimer la classe "active" de tous les boutons : Sinon, plusieurs boutons pourraient rester "actifs", ce qui serait confus visuellement.
      document.querySelectorAll(".btn-filter").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Ajouter la classe "active" seulement au bouton cliqué :
      e.target.classList.add("active");
    }
  });
}

// ----------------- Affichage = Filtre des projets par catégories -----------------

function filterProjects(categoryId, projectsArray) {
  if (categoryId === "all") {
    displayProjects(projectsArray); // affiche tous les projets sans filtrer
  } else {
    const filteredProjects = projectsArray.filter(
      (project) => project.category.id === parseInt(categoryId)
    );
    displayProjects(filteredProjects);
  }
}

// Notes personnelles :

// categoryId → l'ID de la catégorie choisie (ex. "1")

// projectsArray.filter(...) crée un nouveau tableau contenant seulement les projets qui passent le test.

// (project) => project.category.id === parseInt(categoryId)
// Pour chaque projet, on regarde si son category.id correspond au categoryId choisi.
// parseInt(categoryId) transforme la valeur de categoryId en nombre, au cas où categoryId serait une chaîne, pour comparer la même chose

// project.category.id (nombre = id de la catégorie cherchée dans le tableau projectsArray) avec parseInt(categoryId) (string (= valeur du dataSet du bouton dans notre cas) convertie en nombre).

// => Il faut toujours lui donner en comparaison un nombre, car project.category.id est un nombre.
