// ======================================================
// Fichier : login.js
// Description : Gestion de la page de connexion
// Auteur : SIMON Fanny
// Date : 2025-08-20
// ======================================================

// ----------------- Connexion -----------------

// Importation des fonctions d'authentification
import { login, saveAuth } from "./api/authApi.js";

// ----------------- Gestion du formulaire de connexion -----------------

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await login(email, password);
    saveAuth(data); // sauvegarde du token et de l'userId dans le localStorage
    window.location.href = "HomePage.html"; // retourne sur la page d'accueil (mais en mode edition car dans la fonction editPage le token a été sauvegardé dans le localStorage)
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
  }
});

