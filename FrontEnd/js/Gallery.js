// ======================================================
// Fichier : Gallery.js
// Description : Gère l'affichage des projets dans la galerie.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ====================================================== 

  // ----------------- Affichage des projets dans la galerie -----------------

export function displayProjects(projects) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // On vide la galerie pour éviter d'empiler les projets

  projects.forEach((project) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.innerText = project.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}