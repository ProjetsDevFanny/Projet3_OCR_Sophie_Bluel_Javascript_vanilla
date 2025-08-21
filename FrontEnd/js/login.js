// ======================================================
// Fichier : login.js
// Description : Gestion de la connexion
// Auteur : SIMON Fanny
// Date : 2025-08-20
// ======================================================

// ----------------- Connexion -----------------

// Importation des fonctions d'authentification
import { login, saveAuth } from "./api/authApi.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login");
  if (!loginForm) return;

  // ----------------- Gestion du formulaire de connexion -----------------
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const data = await login(email, password);
      saveAuth(data); // sauvegarde du token dans le localStorage
      window.location.href = "HomePage.html";
    } catch (err) {
      document.getElementById("error-message").textContent = err.message;
    }
  });
});
