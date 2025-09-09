// ======================================================
// Fichier : modals.js
// Description : Gestion des modales
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

// Import de la fonction displayProjects depuis gallery.js
import { displayProjects } from "./gallery.js";
import { deleteWork, addWork } from "../api/api.js";
import { projectsArray } from "../main.js";

// ========================== Helpers (fonctions transversales) ==========================

// Ouvre une modale et affiche l’overlay
function openModal(modal) {
  const overlay = document.querySelector(".modal-overlay");
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// Ferme toutes les modales ouvertes
function closeAllModals() {
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.add("hidden"));
  document.querySelector(".modal-overlay").classList.add("hidden");
}

// Attachement des événements de fermeture des modales
// => Click sur la croix, sur l'overlay et sur la touche escape => fermeture des modales avec confirmation
function setupModalsEvents() {
  const overlay = document.querySelector(".modal-overlay");
  const closeBtnModalGallery = document.getElementById(
    "close-btn-modal-gallery"
  );
  const closeBtnModalAddPhoto = document.getElementById(
    "close-btn-modal-add-photo"
  );
  const backBtn = document.querySelector(".back-btn");
  const modalAddPhoto = document.getElementById("modal-add-photo");

  // Fermeture de la modale avec confirmation si clic sur la croix
  if (closeBtnModalGallery && closeBtnModalAddPhoto) {
    closeBtnModalGallery.addEventListener("click", () => {
      const confirmed = confirm(
        "Êtes-vous sûr de vouloir quitter ?\nLes modifications non validées seront perdues."
      );
      if (confirmed) closeAllModals();
    });
    closeBtnModalAddPhoto.addEventListener("click", () => {
      const confirmed = confirm(
        "Êtes-vous sûr de vouloir quitter ?\nLes modifications non validées seront perdues."
      );
      if (confirmed) closeAllModals();
    });
  }

  // Fermeture de la modale avec confirmation si clic sur l'overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      const confirmed = confirm(
        "Êtes-vous sûr de vouloir quitter ?\nLes modifications non validées seront perdues."
      );
      if (confirmed) closeAllModals();
    });
  }

  // Fermeture de la modale avec confirmation si touche Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const confirmed = confirm(
        "Êtes-vous sûr de vouloir quitter ?\nLes modifications non validées seront perdues."
      );
      if (confirmed) closeAllModals();
    }
  });

  // Retour en arrière avec confirmation
  backBtn.addEventListener("click", () => {
    const confirmed = confirm(
      "Êtes-vous sûr de vouloir revenir en arrière ?\nValidez votre projet avant, sinon il risque d'être perdu."
    );
    if (!confirmed) return;
    clearForm();
    modalAddPhoto.classList.add("hidden");
  });
}
// Attachement des événements de fermeture des modales (1 fois au chargement)
setupModalsEvents();

// Vider le formulaire d'ajout de photo, après ajout d'une projet (modale Ajout Photo)
function clearForm() {
  const title = document.getElementById("title");
  const categorySelect = document.getElementById("category-select");
  const fileInput = document.getElementById("file-input");
  const uploadedImage = document.getElementById("uploadedImage");
  const uploadPhotoContainer = document.querySelector(".uploadPhoto-container");

  if (title) title.value = "";
  if (categorySelect) categorySelect.value = "";
  if (fileInput) fileInput.value = "";
  if (uploadedImage) uploadedImage.remove(); // l'enlève du DOM mais il exite toujours en mémoire (on peut y accéder en JS)

  // Réafficher le conteneur d'upload avec les éléments centrés correctement
  if (uploadPhotoContainer) {
    uploadPhotoContainer.style.display = "flex";
  }
}

// ========================== 1ère Modale : Gallery Display ==========================

// Chargement de la modale Gallery Display (au click sur le btn-modifier)
export async function loadModalGallery(projectsArray) {
  const modalGalleryDisplay = document.getElementById("modal-gallery-display");
  displayProjectsModal(projectsArray); // Toujours utiliser la source globale projectsArray : mise à jour au chargement
  openModal(modalGalleryDisplay);
}

// Affiche les projets dans la modale Gallery Display
function displayProjectsModal(projectsArray) {
  const galleryEditModal = document.querySelector(".gallery-edit");
  galleryEditModal.innerHTML = "";

  projectsArray.forEach((project) => {
    // Chaque itération de projectsArray.forEach() crée sa propre variable figure et son propre supprPhotoIcon`.
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.innerText = project.title;

    // Création et gestion de la suppression (modale Gallery Display)
    const supprPhotoIcon = document.createElement("i");
    supprPhotoIcon.classList.add("fa-solid", "fa-trash-can", "supprPhotoIcon");
    supprPhotoIcon.dataset.id = project.id;

    // Sur chaque icone (qui contient le dataset) on lui applique un addEventListener:
    supprPhotoIcon.addEventListener("click", async () => {
      // la fonction callback {...} "capture" la variable figure de son scope.
      const confirmed = confirm("Voulez-vous vraiment supprimer ce projet ?");
      if (!confirmed) return;

      try {
        await deleteWork(project.id); // supprime côté serveur (c'est le dataset=id de l'icone poubelle qui lui a indiqué)

        // Supprime du tableau global projectsArray
        const index = projectsArray.findIndex((p) => p.id === project.id); // index = représente la position dans le tableau du projet qu’on veut supprimer.
        if (index > -1) projectsArray.splice(index, 1); // Si l'élement existe: suppression d'un seul élément à la position index (=> findIndex va retourner -1 s'il ne trouve pas l'élément)

        // Supprime du DOM de la modale
        figure.remove();
        // ✔️ figure.remove() fonctionne parce que chaque icône et son <figure>
        //    sont créés dans le même scope (la même "boîte" de variables).
        // ✔️ Comme on est dans le forEach, chaque itération crée un nouveau couple
        //    (figure + icône). Donc quand on clique sur une icône, elle supprime
        //    uniquement SA figure.

        // Met à jour la galerie Home
        displayProjects(projectsArray);
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Impossible de supprimer le projet. Merci de réessayer.");
      }
    });

    figure.append(img, caption, supprPhotoIcon);
    galleryEditModal.appendChild(figure);
  });
}

// ========================== 2ème Modale : Ajout Photo ==========================

// Bouton "Ajouter une photo" → ouvre la 2ème modale
const addPhotoBtn = document.querySelector("#addPhotoBtn");
addPhotoBtn.addEventListener("click", () => {
  openAddPhotoModal();
});

// Fonction qui ouvre la modale add-photo
function openAddPhotoModal() {
  const modalAddPhoto = document.getElementById("modal-add-photo");
  openModal(modalAddPhoto);
}

// -------- Mise en place de la modale addPhoto (formulaire d'ajout d'un projet)-------------------

// Mise en place de la modale Ajout Photo
function setupAddPhotoModal() {
  const modalAddPhoto = document.getElementById("modal-add-photo");
  const addPhotoSubmitBtn = document.getElementById("submit-addPhotoBtn"); // Bouton submit du formulaire
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn"); // Bouton upload photo
  const fileInput = document.getElementById("file-input"); // Input file pour l'upload de la photo

  // Upload photo → input + aperçu
  uploadPhotoBtn.addEventListener("click", () => fileInput.click()); // simulation de clic sur le bouton upload photo (car on ne peut pas cliquer sur l'input file) "tu fais comme si tu cliquais sur fileInput"

  // On écoute l'événement "change" sur l'input file (quand l'utilisateur choisi un fichier)
  fileInput.addEventListener("change", () => {
    // On récupère le premier fichier sélectionné
    const file = fileInput.files[0];
    if (!file) return; // Si aucun fichier n'a été sélectionné, on sort de la fonction

    // On crée un objet FileReader pour lire le contenu du fichier
    const reader = new FileReader();
    // Quand la lecture du fichier est terminée, cette fonction est appelée
    reader.onload = () => {
      // On cherche s'il existe déjà un ancien aperçu et on le supprime
      const oldPreview = modalAddPhoto.querySelector("#uploadedImage");
      if (oldPreview) oldPreview.remove();

      // Masquer le conteneur d'upload (tout le contenu de présentation)
      const uploadPhotoContainer = modalAddPhoto.querySelector(
        ".uploadPhoto-container"
      );
      if (uploadPhotoContainer) uploadPhotoContainer.style.display = "none";

      // Créer et insérer l’aperçu
      const img = document.createElement("img");
      img.id = "uploadedImage"; // on lui donne un id pour pouvoir le retrouver et le supprimer si nécessaire
      img.src = reader.result; // src = contenu du fichier convertit en base64 par FileReader
      // console.log("Image uploadée: en Data URL au format base64 : ", img.src);
      img.alt = "Aperçu de la photo choisie"; // texte alternatif pour l'image

      // On ajoute l'image dans le div prévu pour l'aperçu
      const uploadPhotoDiv = modalAddPhoto.querySelector(".uploadPhoto");
      if (uploadPhotoDiv) uploadPhotoDiv.appendChild(img);
    };
    // On lance la lecture du fichier en DataURL (base64) pour pouvoir l'afficher dans <img>
    reader.readAsDataURL(file);
  });

  // ----- Vérification des champs pour activer le bouton submit (coloration verte)-----
  function checkFormCompletion() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;
    const fileInput = document.getElementById("file-input");

    if (fileInput.files[0] && title && category) {
      addPhotoSubmitBtn.classList.add("verified-add-photo-form");
    } else {
      addPhotoSubmitBtn.classList.remove("verified-add-photo-form");
    }
  }

  // Écouter les changements sur les champs
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category-select");

  if (titleInput) titleInput.addEventListener("input", checkFormCompletion);
  if (categorySelect)
    categorySelect.addEventListener("change", checkFormCompletion);
  if (fileInput) fileInput.addEventListener("change", checkFormCompletion);

  // Vérification initiale
  checkFormCompletion();

  //---------------------------------------

  // Submit du formulaire si tous les champs sont remplis → envoi à l’API
  addPhotoSubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;

    // Vérification de la présence de l'image uploadée
    if (!fileInput.files[0]) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    // Vérification des champs titre et catégories
    if (!title || !category) {
      alert("Veuillez remplir tous les champs s.v.p");
      return;
    }

    // Création du FormData
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", title);
    formData.append("category", category);

    // Ajout du projet à l'API
    try {
      const newProject = await addWork(formData); // addWork doit renvoyer le projet ajouté
      projectsArray.push(newProject); // on ajoute au tableau global
      addPhotoSubmitBtn.classList.remove("verified-add-photo-form");
      alert("Projet ajouté avec succés !");
      clearForm();
      closeAllModals();
      displayProjectsModal(projectsArray); // On met à jour la galerie de la 1ere modale
      displayProjects(projectsArray); // on met à jour la galerie Home immédiatement après l’ajout, sans recharger la page :
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Impossible d'ajouter le projet. Merci de réessayer.");
    }
  });
}
// Mise en place de la modale Ajout Photo : Attachement des événements de la modale addPhoto (1 fois au chargement)
setupAddPhotoModal();

// ========================== Injecter les catégories dans le select ( modal Ajout Photo)==========================

export function injectCategoriesInSelect(categories) {
  const select = document.querySelector("#category-select");
  const newSetSelect = new Set();
  const uniqueCategoriesSelect = categories.filter((cat) => {
    if (newSetSelect.has(cat.id)) return false;
    newSetSelect.add(cat.id);
    return true;
  });
  uniqueCategoriesSelect.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
