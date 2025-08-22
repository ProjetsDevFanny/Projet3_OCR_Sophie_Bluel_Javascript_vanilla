// ======================================================
// Fichier : api.js
// Description : Gestion des requêtes API pour les projets et catégories
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

import { API_URL } from "./config.js";
import { getToken } from "./authApi.js";

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

// Ajouter un projet
export async function addWork(formData) {
  const token = getToken();
  console.log("🔑 Token récupéré:", token ? "Token trouvé" : "Aucun token");
  console.log("🔑 Token complet:", token);

  if (!token) throw new Error("Utilisateur non authentifié");

  // Vérifier l'expiration du token
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();
    console.log("⏰ Token expiré:", now > expirationDate);

    if (now > expirationDate) {
      throw new Error("Token expiré");
    }
  } catch (error) {
    console.error("❌ Erreur décodage token:", error);
  }

  const response = await fetch(`${API_URL}/works`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // FormData contient { image, title, category }
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l’ajout du projet");
  }

  return response.json();
}

// Supprimer un projet
export async function deleteWork(workId) {
  const token = getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const response = await fetch(`${API_URL}/works/${workId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du projet");
  }

  return true; // suppression réussie
}

// ----------------- Catégories -----------------

// Récupérer les catégories
export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des catégories");
  }
  const data = await response.json();
  console.log("Catégories récupérées :", data);
  return data;
}
