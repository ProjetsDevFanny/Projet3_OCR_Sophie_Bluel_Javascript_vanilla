// ======================================================
// Fichier : Api.js
// Description : Gère la communication avec l'API.
// Auteur : SIMON Fanny
// Date : 2025-08-17
// ======================================================

const API_URL = "http://localhost:5678/api";

// ----------------- Récupération des projets depuis l'API -----------------

export async function fetchWorks() {
  const response = await fetch(`${API_URL}/works`);
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error("Erreur 401 : Non autorisé. Vérifiez le token.");
      case 404:
        throw new Error("Erreur 404 : Ressource non trouvée.");
      case 500:
        throw new Error("Erreur 500 : Erreur serveur. Réessayez plus tard.");
      default:
        throw new Error("Erreur HTTP : " + response.status);
    }
  }
  const data = await response.json();
  console.log("Projets récupérés :", data);
  return data;
}

// ----------------- Récupération des catégories depuis l'API -----------------

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des catégories");
  const data = await response.json();
  console.log("Catégories récupérées :", data);
  return data;
}
