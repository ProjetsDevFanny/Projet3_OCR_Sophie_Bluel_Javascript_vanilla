// ======================================================
// Fichier : authApi.js
// Description : Gestion des requêtes liées à l'authentification
// Auteur : SIMON Fanny
// Date : 2025-08-20
// ======================================================

import { API_URL } from "./config.js";

// ----------------- Connexion utilisateur -----------------

export async function login(email, password) {
  if (!email || !password) {
    throw new Error(
      "Veuillez renseigner un email et un mot de passe s'il vous plait."
    );
  }
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Indique au serveur que le corps de la requête sera au format JSON. Le serveur saura donc faire un JSON.parse() pour récupérer les données.
    body: JSON.stringify({ email, password }), // JSON.stringify transforme un objet JavaScript en chaîne JSON. C’est ce que le backend attend pour l’authentification.
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      // 401 = Unauthorized et 404 = Not Found
      throw new Error("Identifiants incorrects");
    }
    throw new Error("Erreur lors de la connexion");
  }

  return response.json(); // Contient normalement { token, userId }
}

// -------------Ce que l'on peut faire grâce au token récupéré -----------

// ----------------- Sauvegarde Auth -----------------

export function saveAuth(data) {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  if (data.userId) {
    localStorage.setItem("userId", data.userId);
  }
}

// ----------------- Déconnexion utilisateur -----------------

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

// ----------------- Récupération Token -----------------

export function getToken() {
  return localStorage.getItem("token"); // renvoie ce qu'il y a dans le local storage (string ou null)
}
