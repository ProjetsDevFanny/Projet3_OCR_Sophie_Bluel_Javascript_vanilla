// ======================================================
// Fichier : api.js
// Description : Gestion des requêtes API pour les projets et catégories
// Auteur : SIMON Fanny
// Date : 2025-08-21
// ======================================================

import { API_URL } from "./config.js";
import { getToken } from "./authApi.js";

// ------------------ Interpétation et gestion des réponses API ------------------

export function handleApiResponse(
  response,
  customMessage = "Erreur lors de la requête" // message(paramètre) par défaut
) {
  if (!response.ok) {
    // Gestion spécifique de l'erreur 401 (unauthorized)
    if (response.status === 401) {
      localStorage.removeItem("token");
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      window.location.href = "/FrontEnd/pages/login.html";
      throw new Error("Token expiré ou invalide"); // cas particulier pour unauthorized
    }
    throw new Error(`${customMessage} (HTTP ${response.status})`); // sinon, tous les autres cas
  }
  return response;
}

// ------------------ Vérifier présence et expiration du token ---------------------------------
// => intéressant pour gèrer le front (UI) mais n'apporte pas de sécurité réelle = la vérification du token est surtout faite côté serveur dans le backend)	------------------

// Fonction pour vérifier la validité et l'expiration d'un token JWT (côté client uniquement)
export function checkTokenExpiration(token) {
  if (!token) throw new Error("Utilisateur non authentifié");

  let payload; // variable qui contiendra le contenu du token (payload)
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
    // On décode le token :
    // - token.split(".")[1] prend la 2e partie du token (le payload encodé en Base64)
    // - atob() décode la chaîne Base64 en texte
    // - JSON.parse() transforme le texte JSON en objet JavaScript
  } catch {
    // Si le token est mal formé ou corrompu, on lance une erreur
    throw new Error("Token invalide ou corrompu");
  }
  // On récupère la date d'expiration du token (payload.exp est en secondes depuis Epoch (=pt de départ pour mesurer le temps))
  const expirationDate = new Date(payload.exp * 1000);
  const now = new Date(); // date actuelle

  // Déconnexion immédiate si token est déjà expiré (exemple lors d'une requête)
  if (now >= expirationDate) {
    localStorage.removeItem("token");
    window.location.href = "/FrontEnd/pages/login.html";
    throw new Error("Délais de connexion dépassé, veuillez vous reconnecter.");
  }
  // Si le token n'est pas encore expiré, on calcule le délai restant avant expiration
  const delay = expirationDate - now; // en millisecondes

  //  On programme une déconnexion automatique quand le token expirera
  setTimeout(() => {
    alert("Délais de connexion dépassé, veuillez vous reconnecter.");
    localStorage.removeItem("token");
    window.location.href = "/FrontEnd/pages/login.html";
  }, delay);

  return true; // token valide
}

// ----------------- Récupération des projets depuis l'API -----------------

// Pour le mode public (hors connexion)
export async function fetchWorksPublic() {
  try {
    const response = await fetch(`${API_URL}/works`);
    handleApiResponse(
      response,
      "Erreur lors de la récupération des projets en mode public"
    );

    const data = await response.json();
    console.log("Projets récupérés :", data);
    return data;

    //le catch attrape toutes les erreurs de fetchWorksPublic (dont celles lancées dans le handleApiResponse)
  } catch (error) {
    console.error("Erreur fetchWorksPublic :", error); // Different du console.log (gèrer les info générales) ici sert à afficher les messages d'erreur
    // Permet de renvoyer ce qui ne va pas, sans faire planter le code avec un throw.
    throw error; // on lance l'erreur et on la rattrapera avec un try/catch là où elle sera appelée
  }
}

// Pour le mode admin (connexion avec token)
export async function fetchWorksAdmin() {
  try {
    const token = getToken(); // peut être null
    checkTokenExpiration(token); // gère le cas "null", invalide, expiré (côté client uniquement)

    const response = await fetch(`${API_URL}/works`, {
      // on envoie le token dans l'entête, à l’API pour prouver qu’on est bien authentifié: et le serveur vérifie le token
      // Bearer: un token de type « porteur » (= le serveur doit le vérifier).
      headers: { Authorization: `Bearer ${token}` },
    });

    handleApiResponse(
      response,
      "Erreur lors de la récupération des projets en mode privé"
    );

    return await response.json();
  } catch (error) {
    console.error("Erreur fetchWorksAdmin :", error);
    throw error; // on lance l'erreur et on la rattrapera avec un try/catch là où elle sera appelée
  }
}

// ----------------- Ajouter un projet -----------------

export async function addWork(formData) {
  try {
    const token = getToken();
    checkTokenExpiration(token);

    const response = await fetch(`${API_URL}/works`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // FormData contient { image, title, category }
    });

    handleApiResponse(response, "Erreur lors de l’ajout du projet");

    return response.json();
  } catch (error) {
    console.error("Erreur addWork :", error);
    throw error; // on lance l'erreur et on la rattrapera avec un try/catch là où elle sera appelée
  }
}

// ----------------- Supprimer un projet -----------------

export async function deleteWork(workId) {
  try {
    const token = getToken();
    checkTokenExpiration(token);

    const response = await fetch(`${API_URL}/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    handleApiResponse(response, "Erreur lors de la suppression du projet");
    // Pas besoin de parser le JSON (car pas besoin de récupérer les données après le delete)
  } catch (error) {
    console.error("Erreur deleteWork:", error);
    throw error; // on lance l'erreur et on la rattrapera avec un try/catch là où elle sera appelée
  }
}

// ----------------- Récupérer les catégories -----------------

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    handleApiResponse(
      response,
      "Erreur lors de la récupération des catégories"
    );
    const data = await response.json();
    console.log("Catégories récupérées :", data);
    return data;
  } catch (error) {
    console.error("Erreur fetchCategories:", error);
    throw error; // on lance l'erreur et on la rattrapera avec un try/catch là où elle sera appelée
  }
}
