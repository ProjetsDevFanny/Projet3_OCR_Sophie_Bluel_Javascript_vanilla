// ======================================================
// Fichier : gallery.js
// Description : Gère l'affichage de la galerie de projets
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Affichage des projets -----------------

export function displayProjects(projectsArray) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  projectsArray.forEach((project) => {
    const figure = document.createElement("figure");
    figure.dataset.category = project.category.id;

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
