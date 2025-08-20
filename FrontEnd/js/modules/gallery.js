// ======================================================
// Fichier : gallery.js
// Description : Gère l'affichage des projets dans la galerie.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ====================================================== 

  // ----------------- Affichage des projets dans la galerie -----------------

export function displayProjects(projects) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  // On vide la galerie pour éviter d'empiler les projets
  gallery.innerHTML = "";

  // On crée une figure pour chaque projet
  projects.forEach((project) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = project.imageUrl; // On récupère l'URL de l'image
    img.alt = project.title; // On récupère le titre du projet

    // On crée un élément figcaption pour le titre du projet
    const caption = document.createElement("figcaption");
    caption.innerText = project.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}