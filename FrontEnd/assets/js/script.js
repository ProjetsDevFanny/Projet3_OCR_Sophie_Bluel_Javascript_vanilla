let projects = [];

// Fonction pour aller chercher les données de l'API
async function fetchProjects() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json()) // On transforme la réponse en JSON
    .then((data) => {
      projects = data; // Stocke les données API dans "projects"
      console.log(projects); // toujours ce garder l'objet ouvert dans la console
      displayProjects(); //  On appelle cette fonction après avoir reçu les données
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des projets :", error)
    ); // Gestion des erreurs
}

// Fonction pour afficher les projets :
// on créer une figure pour chaque projet
// on y ajoute l'image et le titre
// on ajoute la figure dans la gallery.

function displayProjects() {
  projects.forEach((project) => {
    const gallery = document.querySelector(".gallery");
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

// Charger les projets au démarrage
fetchProjects();
