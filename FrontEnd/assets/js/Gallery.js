// ********** Mise en place de la galerie et des boutons de filtrage **********

let projectsArray = [];
const gallery = document.querySelector(".gallery");
let uniqueCategories = [];

// Fonction pour aller chercher les données de l'API
async function fetchProjects() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    projectsArray = data;

    console.log("Projets récupérés :", projectsArray);

    createButtons(); // On crée les boutons maintenant que les projets sont dispo
    displayProjects(projectsArray); // On affiche tous les projets
    setUpButtonListeners(); // On ajoute les écouteurs de clic après avoir créé les boutons
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

// Fonction pour afficher les projets :
// on créer une figure pour chaque projet
// on y ajoute l'image et le titre
// Enfin on ajoute la figure dans la gallery.

function displayProjects(projectsArray) {
  gallery.innerHTML = ""; // On vide la galerie pour éviter d'empiler les projets
  projectsArray.forEach((project) => {
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

// Fonction pour nettoyer les catégories :
function normalizeCategoryName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

//  Fonction de création des boutons :
function createButtons() {
  // Création du tableau des catégories (on va les chercher dans l'API):
  const categoriesArray = projectsArray.map((project) => project.category.name);
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
    const refreshCategory = normalizeCategoryName(category);
    btn.classList.add("btn"); // classe générique
    btn.classList.add(`btn-${refreshCategory}`);
    if (category === "Tous") {
      btn.dataset.category = "all"; // pour le filtrage des projets plus tard
      btn.classList.add("active");
    } else {
      btn.dataset.category = refreshCategory;
    }
    btn.textContent = category;
    btnContainer.appendChild(btn);
  });
}

// Gestion des évènements au clic sur les boutons  et filtrage des projets:
function setUpButtonListeners() {
  const btnContainer = document.querySelector(".btn-container");
  if (!btnContainer) return;

  btnContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const category = e.target.dataset.category;
      console.log("Filtrer par catégorie :", category);
      filterProjects(category);

      // Supprimer  la classe "active" de tous les boutons :
      const allBtns = document.querySelectorAll(".btn");
      allBtns.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Ajouter la classe "active" au bouton cliqué :
      e.target.classList.add("active");
    }
  });
}

//Fonction pour filtrer les projets par catégories:
function filterProjects(category) {
  let filteredProjects;

  if (category === "all") {
    filteredProjects = projectsArray;
  } else {
    filteredProjects = projectsArray.filter((project) => {
      return normalizeCategoryName(project.category.name) === category;
    });
  }

  console.log(filteredProjects);
  gallery.innerHTML = ""; // On vide la galerie avant d’afficher les projets filtrés
  displayProjects(filteredProjects);
}

// Charger les projets au démarrage
fetchProjects();
