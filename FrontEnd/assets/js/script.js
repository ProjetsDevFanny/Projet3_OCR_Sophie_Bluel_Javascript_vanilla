let projects = [];
const gallery = document.querySelector(".gallery");
let uniqueCategories = [];

// Fonction pour aller chercher les données de l'API
async function fetchProjects() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json()) // On transforme la réponse en JSON
    .then((data) => {
      projects = data; // Stocke les données API dans "projects"
      console.log(projects); // toujours ce garder l'objet ouvert dans la console
      createButtons();
      displayProjects(); //  On appelle cette fonction après avoir reçu les données
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des projets :", error)
    ); // Gestion des erreurs
}

// Fonction pour afficher les projets :
// on créer une figure pour chaque projet
// on y ajoute l'image et le titre
// Enfin on ajoute la figure dans la gallery.

function displayProjects() {
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


//  Fonction de création des boutons :
function createButtons() {
  // Création du tableau des catégories (on va les chercher dans l'API):
  const categoriesArray = projects.map((project) => project.category.name);
  // suppression des doublons et création des boutons:
  uniqueCategories = [...new Set(categoriesArray)];
  uniqueCategories.unshift("Tous"); // on ajoute "Tous" comme 1er élement du tableau
  console.log(uniqueCategories);
  
  // Création du container des boutons, seulement s'il n'existe pas :
  let btnContainer = document.querySelector(".btn-container");
  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    document.getElementById("portfolio").insertBefore(btnContainer, gallery);
  }
  btnContainer.innerHTML = ""; // On vide ce container à chaque appel pour éviter d’empiler les boutons.

  // Création des boutons :
  uniqueCategories.forEach((category) => {
    const btn = document.createElement("button");
    // Nettoyage du nom de la catégorie pour des noms de classe et dataSet standardisés (tout en minuscules, sans espaces, sans caractères spéciaux):
    const refreshCategory = category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    btn.classList.add("btn"); // classe générique
    btn.classList.add(
      `btn-${refreshCategory}`
    );
    if (category === "Tous") {
      btn.dataset.category = "all"; // pour le filtrage des projets plus tard
    } else {
      btn.dataset.category = refreshCategory;
    }
    btn.textContent = category;
    btnContainer.appendChild(btn);
  });
}





// Charger les projets au démarrage
fetchProjects();
