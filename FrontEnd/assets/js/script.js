let projects = [];

// Fonction pour aller chercher les données de l'API
async function fetchProjects() {
  await fetch('http://localhost:5678/api/works')
    .then((res) => res.json()) // On transforme la réponse en JSON
    .then((data) => {
      projects = data; // Stocke les données API dans "projects"
      console.log(projects); // toujours ce garder l'objet ouvert dans la console
      // projectsDisplay(); // ⬅️ On appelle cette fonction après avoir reçu les données
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des projets :", error)
    ); // Gestion des erreurs
}

// Charger les projets au démarrage
fetchProjects();