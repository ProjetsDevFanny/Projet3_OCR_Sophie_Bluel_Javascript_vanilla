// ======================================================
// Fichier : api.js
// Description : Gestion des requêtes API pour les projets et catégories
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

import { API_URL } from "./config.js";
import { getToken } from "./authApi.js";

// ------------------ Gestion des réponses API ------------------

export function handleApiResponse(
  response,
  customMessage = "Erreur lors de la requête"
) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/FrontEnd/pages/login.html";
      throw new Error("Token expiré ou invalide");
    }
    throw new Error(`${customMessage} (HTTP ${response.status})`);
  }
  return response;
}

// ------------------ Vérifier présence et expiration du token ------------------

export async function checkTokenExpiration(token) {
  if (!token) throw new Error("Utilisateur non authentifié");

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    throw new Error("Token invalide ou corrompu");
  }

  const expirationDate = new Date(payload.exp * 1000);
  const now = new Date(); // date actuelle

  // Déconnexion immédiate si token déjà expiré (exemple lors d'une requête)
  if (now >= expirationDate) {
    localStorage.removeItem("token");
    window.location.href = "/FrontEnd/pages/login.html";
    throw new Error("Délais de connexion dépassé, veuillez vous reconnecter.");
  }

  // Déconnexion automatique quand le token expirera
  const delay = expirationDate - now; // en ms
  setTimeout(() => {
    alert("Token expiré");
    localStorage.removeItem("token");
    window.location.href = "/FrontEnd/pages/login.html";
  }, delay);

  return true; // token valide
}

// ----------------- Récupération des projets depuis l'API -----------------

// Pour le mode public (hors connexion)
export async function fetchWorksPublic() {
  const response = await fetch(`${API_URL}/works`);
  handleApiResponse(
    response,
    "Erreur lors de la récupération des projets publics"
  );
  const data = await response.json();
  console.log("Projets récupérés :", data);
  return data;
}

// Pour le mode admin (connexion avec token)
export async function fetchWorksAdmin() {
  const token = getToken();
  await checkTokenExpiration(token);

  const response = await fetch(`${API_URL}/works`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  handleApiResponse(
    response,
    "Erreur lors de la récupération des projets privés"
  );
  return response.json();
}

// ----------------- Ajouter un projet -----------------

export async function addWork(formData) {
  const token = getToken();
  await checkTokenExpiration(token);

  const response = await fetch(`${API_URL}/works`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // FormData contient { image, title, category }
  });

  handleApiResponse(response, "Erreur lors de l’ajout du projet");

  return response.json();
}

// ----------------- Supprimer un projet -----------------

export async function deleteWork(workId) {
  const token = getToken();
  await checkTokenExpiration(token);

  const response = await fetch(`${API_URL}/works/${workId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  handleApiResponse(response, "Erreur lors de la suppression du projet");
  return { success: true, message: "Projet supprimé avec succès" };
}

// ----------------- Récupérer les catégories -----------------

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  handleApiResponse(response, "Erreur lors de la récupération des catégories");
  const data = await response.json();
  console.log("Catégories récupérées :", data);
  return data;
}
