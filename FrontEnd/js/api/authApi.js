// ======================================================
// Fichier : authApi.js
// Description : Gestion des requêtes liées à l'authentification
// Auteur : SIMON Fanny
// Date : 2025-08-20
// ======================================================

import { API_URL } from "./config.js";

// ----------------- Connexion utilisateur -----------------
export async function login(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) { // 401 = Unauthorized
      throw new Error("Identifiants incorrects");
    }
    throw new Error("Erreur lors de la connexion");
  }

  return response.json(); // Contient normalement { token, userId }
}

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
  return localStorage.getItem("token");
}

// ----------------- Vérification Auth -----------------
export function isLoggedIn() {
  return Boolean(getToken());
}