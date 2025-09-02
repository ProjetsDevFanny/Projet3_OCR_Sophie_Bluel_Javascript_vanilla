// ======================================================
// Fichier : Navbar.js
// Description : Gère le menu de navigation.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Gestion du menu de navigation (savoir quel lien mettre en surbrillance) -----------------

export function clickNavbarLinks() {
  const allNavbarLinks = document.querySelectorAll("nav ul li a");
  if (!allNavbarLinks) return;

  const currentPath = window.location; // Récupérer le chemin(URL) de la page courante

  allNavbarLinks.forEach((link) => {
    const linkPath = new URL(link.href); // Récupérer le chemin (URL) complet de la page liée
    // link.href en JavaScript retourne l’URL complète, pas seulement ce qui est écrit dans le HTML !

    // ------------  exemple concret ----------:
    // console.log(link.href); => "http://127.0.0.1:5500/FrontEnd/pages/HomePage.html#portfolio"
    // const linkPath = new URL(link.href);
    // console.log(linkPath.pathname);  (le chemin de la page) => /FrontEnd/pages/HomePage.html"
    // console.log(linkPath.hash);     // l'ancre => "#portfolio"

    //---------------------------------------------

    // Si lien cliqué est sur la page courante, et son ancre aussi, alors on ajoute la classe "active-nav "(= font-weight: 600) cela permet que seul le lien de la page (avec son ancre spécifique) (et pas ceux des autres pages) se mette en surbrillance
    if (
      linkPath.pathname === currentPath.pathname &&
      linkPath.hash === currentPath.hash // sans cette vérification : tous les liens de la même page seraient considérés comme actifs, même s’ils pointent vers des section différentes.
    ) {
      link.classList.add("active-nav");
    }

    // Gérer le clic
    link.addEventListener("click", () => {
      allNavbarLinks.forEach((l) => l.classList.remove("active-nav")); // Supprimer la classe "active-nav" de tous les liens
      link.classList.add("active-nav");
    });
  });
}

// --------------------- Explications: -----------------

// Au chargement de la page:
// -> La fonction vérifie tous les liens de ta <nav>.
// -> Elle compare l’URL du lien (linkPath.pathname + linkPath.hash) avec l’URL actuelle (window.location).
// -> Si ça correspond, elle ajoute la classe active-nav automatiquement au bon lien.
// -> Sert à mettre en évidence la page (et même la section via #ancre) où l'on se trouve.

// Au clic sur un lien:
// -> Elle enlève la classe active-nav de tous les liens.
// -> Elle ajoute la classe active-nav seulement sur le lien cliqué.
// -> Permet de mettre à jour la surbrillance dans la navbar quand l’utilisateur navigue.
