// ======================================================
// Fichier : Navbar.js
// Description : Gère le menu de navigation.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

// ----------------- Gestion du menu de navigation -----------------

export function clickNavbarLinks() {
  const allNavbarLinks = document.querySelectorAll("nav ul li a");
  if (!allNavbarLinks) return;

  const currentPath = window.location; // Récupérer le chemin de la page courante

  allNavbarLinks.forEach((link) => {
    const linkPath = new URL(link.href); // Récupérer le chemin de la page liée

    // Ajouter automatiquement la classe "active-nav" si le lien correspond à la page ET à l'ancre (hash)
    if (
      linkPath.pathname === currentPath.pathname &&
      linkPath.hash === currentPath.hash
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
